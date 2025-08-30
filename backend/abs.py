import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin


def get_abs_data(category_id: str) -> Dict[str, Any]:
    """
    Get ABS data for a specific category ID.
    
    Args:
        category_id (str): The ABS category ID (e.g., "5232.0.55.001")
    
    Returns:
        Dict[str, Any]: Dictionary containing parsed ABS data and Excel file information
        
    Raises:
        requests.RequestException: If the API request fails
        ValueError: If the category_id is invalid
        Exception: For other parsing errors
    """
    try:
        # Validate category_id format (basic validation)
        if not category_id or not isinstance(category_id, str):
            raise ValueError("Category ID must be a non-empty string")
        
        # Construct the ABS API URL
        # The ABS API endpoint for time series data
        api_url = "https://abs.gov.au/servlet/TSSearchServlet?catno=" + str(category_id)
        
        print(f"Making request to ABS API: {api_url}")
        
        # Make request to ABS API
        headers = {
            'Accept': 'application/xml',
            'User-Agent': 'GovHack-Backend/1.0'
        }
        
        response = requests.get(api_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Parse the XML response
        root = ET.fromstring(response.content)
        
        # Extract series information
        series_data = []
        excel_files = []
        seen_urls = set()  # Track unique URLs
        
        # Find all Series elements
        for series in root.findall('.//Series'):
            series_info = {}
            
            # Extract basic series information
            series_info['product_number'] = series.find('ProductNumber').text if series.find('ProductNumber') is not None else None
            series_info['product_title'] = series.find('ProductTitle').text if series.find('ProductTitle') is not None else None
            series_info['product_issue'] = series.find('ProductIssue').text if series.find('ProductIssue') is not None else None
            series_info['product_release_date'] = series.find('ProductReleaseDate').text if series.find('ProductReleaseDate') is not None else None
            series_info['product_url'] = series.find('ProductURL').text if series.find('ProductURL') is not None else None
            series_info['table_url'] = series.find('TableURL').text if series.find('TableURL') is not None else None
            series_info['table_title'] = series.find('TableTitle').text if series.find('TableTitle') is not None else None
            series_info['table_order'] = series.find('TableOrder').text if series.find('TableOrder') is not None else None
            series_info['description'] = series.find('Description').text if series.find('Description') is not None else None
            series_info['unit'] = series.find('Unit').text if series.find('Unit') is not None else None
            series_info['series_type'] = series.find('SeriesType').text if series.find('SeriesType') is not None else None
            series_info['data_type'] = series.find('DataType').text if series.find('DataType') is not None else None
            series_info['frequency'] = series.find('Frequency').text if series.find('Frequency') is not None else None
            series_info['collection_month'] = series.find('CollectionMonth').text if series.find('CollectionMonth') is not None else None
            series_info['series_start'] = series.find('SeriesStart').text if series.find('SeriesStart') is not None else None
            series_info['series_end'] = series.find('SeriesEnd').text if series.find('SeriesEnd') is not None else None
            series_info['no_obs'] = series.find('NoObs').text if series.find('NoObs') is not None else None
            series_info['series_id'] = series.find('SeriesID').text if series.find('SeriesID') is not None else None
            
            series_data.append(series_info)
            
            # Extract Excel file information if TableURL exists and is unique
            if series_info['table_url'] and series_info['table_url'] not in seen_urls:
                seen_urls.add(series_info['table_url'])
                excel_file_info = {
                    'url': series_info['table_url'],
                    'title': series_info['table_title'],
                    'product_title': series_info['product_title'],
                    'product_number': series_info['product_number'],
                    'series_id': series_info['series_id'],
                    'description': series_info['description'],
                    'unit': series_info['unit'],
                    'frequency': series_info['frequency']
                }
                excel_files.append(excel_file_info)
        
        # Extract series count
        series_count = root.find('SeriesCount')
        series_count_value = int(series_count.text) if series_count is not None else len(series_data)
        
        result = {
            'category_id': category_id,
            'api_url': api_url,
            'series_count': series_count_value,
            'series_data': series_data,
            'excel_files': excel_files,
            'excel_file_count': len(excel_files)
        }
        
        print(f"Successfully parsed ABS data for category {category_id}")
        print(f"Found {series_count_value} series and {len(excel_files)} Excel files")
        
        return result
        
    except requests.RequestException as e:
        raise requests.RequestException(f"Failed to fetch data from ABS API for category {category_id}: {str(e)}")
    except ET.ParseError as e:
        raise Exception(f"Failed to parse XML response from ABS API: {str(e)}")
    except Exception as e:
        raise Exception(f"Error processing ABS data for category {category_id}: {str(e)}")


def get_excel_urls_only(category_id: str) -> List[str]:
    """
    Get only the Excel file URLs for a specific category ID.
    
    Args:
        category_id (str): The ABS category ID
    
    Returns:
        List[str]: List of Excel file URLs
        
    Raises:
        requests.RequestException: If the API request fails
        Exception: For other errors
    """
    try:
        data = get_abs_data(category_id)
        
        return [
            [
                file_info['product_title'],
                file_info['url'],
                data['series_data'][0].get("product_release_date", "unknown")
            ]
            for file_info in data['excel_files']
        ]
    except Exception as e:
        raise Exception(f"Error getting Excel URLs for category {category_id}: {str(e)}")


def get_excel_files_with_metadata(category_id: str) -> List[Dict[str, Any]]:
    """
    Get Excel file information with metadata for a specific category ID.
    
    Args:
        category_id (str): The ABS category ID
    
    Returns:
        List[Dict[str, Any]]: List of Excel file information dictionaries
        
    Raises:
        requests.RequestException: If the API request fails
        Exception: For other errors
    """
    try:
        data = get_abs_data(category_id)
        return data['excel_files']
    except Exception as e:
        raise Exception(f"Error getting Excel files with metadata for category {category_id}: {str(e)}")


# Example usage
if __name__ == "__main__":
    # Test with the example category ID from the XML
    test_category_id = "5232.0.55.001"
    
    try:
        print(f"Testing ABS API with category ID: {test_category_id}")
        
        # Get full data
        data = get_abs_data(test_category_id)
        print(f"\nFull data structure:")
        print(f"Category ID: {data['category_id']}")
        print(f"Series Count: {data['series_count']}")
        print(f"Excel Files: {data['excel_file_count']}")
        
        # Print Excel file information
        print(f"\nExcel Files:")
        for i, file_info in enumerate(data['excel_files'], 1):
            print(f"{i}. {file_info['title']}")
            print(f"   URL: {file_info['url']}")
            print(f"   Product: {file_info['product_title']}")
            print(f"   Description: {file_info['description']}")
            print(f"   Unit: {file_info['unit']}")
            print()
        
        # Test getting only URLs
        urls = get_excel_urls_only(test_category_id)
        print(f"Excel URLs only: {urls}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
