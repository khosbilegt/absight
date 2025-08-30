import json
import os
import requests
import pandas as pd
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
import tempfile
from pathlib import Path
import hashlib


def download_excel_file(url: str, save_path: Optional[str] = None) -> str:
    """
    Download an Excel file from a URL and save it locally.
    
    Args:
        url (str): The URL of the Excel file to download
        save_path (str, optional): Local path to save the file. If None, saves to ./files directory with a generated filename.
    
    Returns:
        str: The path to the downloaded file
        
    Raises:
        requests.RequestException: If the download fails
        ValueError: If the URL is invalid or file is not an Excel file
    """
    try:
        # Validate URL
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise ValueError("Invalid URL provided")
        
        # Make request to download the file
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Check if content type indicates Excel file
        content_type = response.headers.get('content-type', '').lower()
        if not any(excel_type in content_type for excel_type in ['excel', 'spreadsheet', 'vnd.ms-excel', 'vnd.openxmlformats']):
            # Check file extension as fallback
            file_extension = Path(parsed_url.path).suffix.lower()
            if file_extension not in ['.xlsx', '.xls', '.xlsm']:
                print(f"Warning: Content type '{content_type}' and extension '{file_extension}' don't clearly indicate Excel file")
        
        # Determine save path
        if save_path is None:
            # Create files directory if it doesn't exist
            files_dir = "./files"
            os.makedirs(files_dir, exist_ok=True)
            
            # Generate filename from URL hash and original extension
            file_extension = Path(parsed_url.path).suffix or '.xlsx'
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            filename = f"excel_{url_hash}{file_extension}"
            save_path = os.path.join(files_dir, filename)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Download and save the file
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Successfully downloaded Excel file to: {save_path}")
        return save_path
        
    except requests.RequestException as e:
        raise requests.RequestException(f"Failed to download file from {url}: {str(e)}")
    except Exception as e:
        raise Exception(f"Error downloading Excel file: {str(e)}")


def read_excel_data(file_path: str, sheet_name: Optional[str] = None, 
                   header_row: int = 0, max_rows: Optional[int] = None) -> Dict[str, Any]:
    """
    Read data from an Excel file and return it as a dictionary.
    
    Args:
        file_path (str): Path to the Excel file
        sheet_name (str, optional): Name of the sheet to read. If None, reads the first sheet.
        header_row (int): Row number to use as column headers (0-indexed)
        max_rows (int, optional): Maximum number of rows to read
    
    Returns:
        Dict[str, Any]: Dictionary containing:
            - 'data': List of dictionaries (rows as key-value pairs)
            - 'columns': List of column names
            - 'shape': Tuple of (rows, columns)
            - 'sheet_name': Name of the sheet read
            - 'file_path': Path to the file
            
    Raises:
        FileNotFoundError: If the file doesn't exist
        ValueError: If the file is not a valid Excel file
        Exception: For other reading errors
    """
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Read Excel file
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=header_row, nrows=max_rows)
        else:
            df = pd.read_excel(file_path, header=header_row, nrows=max_rows)
        
        # Convert to list of dictionaries
        data = df.to_dict('records')
        
        # Clean up NaN values
        for row in data:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = None
        
        result = {
            'data': data,
            'columns': list(df.columns),
            'shape': df.shape,
            'sheet_name': sheet_name or 'Sheet1',
            'file_path': file_path
        }
        
        print(f"Successfully read Excel file: {file_path}")
        print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
        print(f"Columns: {list(df.columns)}")
        
        return result
        
    except FileNotFoundError:
        raise
    except Exception as e:
        raise Exception(f"Error reading Excel file {file_path}: {str(e)}")


def get_excel_sheet_names(file_path: str) -> List[str]:
    """
    Get the names of all sheets in an Excel file.
    
    Args:
        file_path (str): Path to the Excel file
    
    Returns:
        List[str]: List of sheet names
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        Exception: For other reading errors
    """
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        excel_file = pd.ExcelFile(file_path)
        sheet_names = excel_file.sheet_names
        
        print(f"Found {len(sheet_names)} sheets in {file_path}: {sheet_names}")
        return sheet_names
        
    except FileNotFoundError:
        raise
    except Exception as e:
        raise Exception(f"Error reading sheet names from {file_path}: {str(e)}")


def download_and_read_excel(url: str, sheet_name: Optional[str] = None, 
                          header_row: int = 0, max_rows: Optional[int] = None,
                          save_path: Optional[str] = None, keep_file: bool = True) -> Dict[str, Any]:
    """
    Download an Excel file from a URL and read its data in one operation.
    
    Args:
        url (str): The URL of the Excel file to download
        sheet_name (str, optional): Name of the sheet to read
        header_row (int): Row number to use as column headers
        max_rows (int, optional): Maximum number of rows to read
        save_path (str, optional): Local path to save the file. If None, saves to ./files directory.
        keep_file (bool): Whether to keep the downloaded file after reading. Default True.
    
    Returns:
        Dict[str, Any]: Dictionary containing the Excel data and metadata
        
    Raises:
        requests.RequestException: If the download fails
        Exception: If reading the file fails
    """
    try:
        # Download the file
        file_path = download_excel_file(url, save_path)
        # Read the data
        data = read_excel_data(file_path, sheet_name, header_row, max_rows)
        
        # Add URL to the result
        data['source_url'] = url
        data['file_saved'] = keep_file
        
        # Clean up file if not keeping it
        if not keep_file:
            try:
                os.unlink(file_path)
                data['file_path'] = None  # File was deleted
            except:
                pass
        
        return data
        
    except Exception as e:
        # Clean up downloaded file if it was temporary and not keeping it
        if not keep_file and 'file_path' in locals():
            try:
                os.unlink(file_path)
            except:
                pass
        raise


def cleanup_temp_file(file_path: str) -> None:
    """
    Clean up a temporary file.
    
    Args:
        file_path (str): Path to the file to delete
    """
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            print(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        print(f"Warning: Could not clean up file {file_path}: {str(e)}")


def list_downloaded_files() -> List[Dict[str, Any]]:
    """
    List all Excel files in the ./files directory.
    
    Returns:
        List[Dict[str, Any]]: List of file information dictionaries
    """
    files_dir = "./files"
    if not os.path.exists(files_dir):
        return []
    
    files_info = []
    for filename in os.listdir(files_dir):
        if filename.lower().endswith(('.xlsx', '.xls', '.xlsm')):
            file_path = os.path.join(files_dir, filename)
            stat = os.stat(file_path)
            files_info.append({
                'filename': filename,
                'file_path': file_path,
                'size_bytes': stat.st_size,
                'size_mb': round(stat.st_size / (1024 * 1024), 2),
                'created': stat.st_ctime,
                'modified': stat.st_mtime
            })
    
    return sorted(files_info, key=lambda x: x['modified'], reverse=True)


def delete_downloaded_file(filename: str) -> bool:
    """
    Delete a specific file from the ./files directory.
    
    Args:
        filename (str): Name of the file to delete
    
    Returns:
        bool: True if file was deleted, False otherwise
    """
    try:
        file_path = os.path.join("./files", filename)
        if os.path.exists(file_path):
            os.unlink(file_path)
            print(f"Deleted file: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"Error deleting file {filename}: {str(e)}")
        return False


def excel_to_ai_context(file_path: str, sheet_name: Optional[str] = None, 
                       max_rows: Optional[int] = 1000, max_columns: Optional[int] = 50) -> str:
    """
    Convert Excel data to JSON string format suitable for AI context.
    
    Args:
        file_path (str): Path to the Excel file
        sheet_name (str, optional): Name of the sheet to read. If None, reads the first sheet.
        max_rows (int, optional): Maximum number of rows to include (default: 1000)
        max_columns (int, optional): Maximum number of columns to include (default: 50)
    
    Returns:
        str: JSON string containing the Excel data formatted for AI context
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        Exception: For other reading errors
    """
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Read Excel file
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
        else:
            df = pd.read_excel(file_path)
        
        # Limit rows and columns if specified
        if max_rows and len(df) > max_rows:
            df = df.head(max_rows)
            print(f"Limited to first {max_rows} rows")
        
        if max_columns and len(df.columns) > max_columns:
            df = df.iloc[:, :max_columns]
            print(f"Limited to first {max_columns} columns")
        
        # Clean up data for AI context
        # Replace NaN values with None for proper JSON serialization
        df_clean = df.where(pd.notnull(df), None)
        
        # Convert to list of dictionaries (records format)
        data_records = df_clean.to_dict('records')
        
        # Create context structure
        context_data = {
            "file_info": {
                "file_path": file_path,
                "sheet_name": sheet_name or "Sheet1",
                "total_rows": len(df),
                "total_columns": len(df.columns),
                "columns": list(df.columns)
            },
            "data": data_records,
            "summary": {
                "row_count": len(data_records),
                "column_count": len(df.columns),
                "column_names": list(df.columns),
                "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()}
            }
        }
        
        # Convert to JSON string
        json_string = json.dumps(context_data, indent=2, default=str)
        
        print(f"Converted Excel data to JSON context: {len(data_records)} rows, {len(df.columns)} columns")
        return json_string
        
    except FileNotFoundError:
        raise
    except Exception as e:
        raise Exception(f"Error converting Excel to AI context: {str(e)}")


def excel_to_ai_context_from_url(url: str, sheet_name: Optional[str] = None, 
                                max_rows: Optional[int] = 1000, max_columns: Optional[int] = 50,
                                keep_file: bool = False) -> str:
    """
    Download Excel file from URL and convert to JSON string for AI context.
    
    Args:
        url (str): URL of the Excel file to download
        sheet_name (str, optional): Name of the sheet to read
        max_rows (int, optional): Maximum number of rows to include
        max_columns (int, optional): Maximum number of columns to include
        keep_file (bool): Whether to keep the downloaded file
    
    Returns:
        str: JSON string containing the Excel data formatted for AI context
        
    Raises:
        requests.RequestException: If the download fails
        Exception: For other errors
    """
    try:
        # Download the file
        file_path = download_excel_file(url)
        
        # Convert to AI context
        json_context = excel_to_ai_context(file_path, sheet_name, max_rows, max_columns)
        
        # Clean up file if not keeping it
        if not keep_file:
            try:
                os.unlink(file_path)
            except:
                pass
        
        return json_context
        
    except Exception as e:
        # Clean up downloaded file if it was temporary and not keeping it
        if not keep_file and 'file_path' in locals():
            try:
                os.unlink(file_path)
            except:
                pass
        raise Exception(f"Error converting Excel from URL to AI context: {str(e)}")
