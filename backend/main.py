import json
import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from excel_utils import excel_to_ai_context_from_url
from abs import get_abs_data, get_excel_urls_only

load_dotenv()

app = FastAPI(title="GovHack Backend API", description="API for querying Australian Bureau of Statistics data")

def load_context():
    try:
        with open("metadata.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="metadata.json file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON in metadata.json")

# Request model
class AskRequest(BaseModel):
    question: str
    api_key: str = None  # Optional API key for OpenAI

# Response model
class AskResponse(BaseModel):
    answer: str
    datasets: List[Dict[str, Any]]

# Request model for download endpoint
class DownloadRequest(BaseModel):
    url: str
    sheet_name: Optional[str] = None
    header_row: int = 0
    max_rows: Optional[int] = None
    save_path: Optional[str] = None
    keep_file: bool = True

# Response model for download endpoint
class DownloadResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Response model for ABS endpoint
class ABSResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.get("/api")
async def root():
    return {"message": "GovHack Backend API is running"}

@app.post("/api/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Ask a question about Australian Bureau of Statistics data.
    The context from metadata.json will be used to provide relevant information.
    """
    try:
        # Load context from metadata.json
        context_data = load_context()
        
        # Convert context to string for the AI model
        context_str = json.dumps(context_data, indent=2)
        
        # Prepare the payload for OpenAI API
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system", 
                    "content": f"You are a helpful assistant specializing in Australian Bureau of Statistics data. Use this context about available datasets: {context_str}. Provide only the category ID of the relevant data or 'invalid' in plain string."
                },
                {"role": "user", "content": request.question}
            ],
            "stream": False
        }
        
        # Make request to OpenAI API
        headers = {}
        api_key = request.api_key or os.getenv("OPENAI_API_KEY")
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions", 
            json=payload,
            headers=headers
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"OpenAI API error: {response.text}"
            )
        
        response_data = response.json()
        
        answer = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response received")
        # answer = "8752.0"

        datasets = get_abs_data(answer)

        summary_payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system", 
                    "content": f"You are a helpful assistant specializing in Australian Bureau of Statistics data. Filter at least 3 relevant data and return ONLY json object with fields 'summary' and a 'products' array of objects with 'product_title', 'product_release_date', 'product_url', and 'topics' string array based on title. Use this context about available datasets to summarize the content using the data from context based on question: " + str(datasets)
                },
                {"role": "user", "content": request.question}
            ],
            "stream": False
        }

        response = requests.post(
            "https://api.openai.com/v1/chat/completions", 
            json=summary_payload,
            headers=headers
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"OpenAI API error: {response.text}"
            )
        
        response_data = response.json()
        ai_response = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response received")
        print(ai_response)
        # Parse the AI response to extract summary and datasets
        try:
            # Try to parse as JSON
            parsed_response = json.loads(ai_response)
            summary = parsed_response.get("summary", "No summary available")
            datasets_list = parsed_response.get("products", [])
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks or text
            try:
                # Look for JSON within markdown code blocks
                import re
                json_match = re.search(r'```json\s*(\{.*?\})\s*```', ai_response, re.DOTALL)
                if json_match:
                    parsed_response = json.loads(json_match.group(1))
                    summary = parsed_response.get("summary", "No summary available")
                    datasets_list = parsed_response.get("products", [])
                else:
                    # Try to find JSON object in the text
                    json_match = re.search(r'\{.*"summary".*"products".*\}', ai_response, re.DOTALL)
                    if json_match:
                        parsed_response = json.loads(json_match.group(0))
                        summary = parsed_response.get("summary", "No summary available")
                        datasets_list = parsed_response.get("products", [])
                    else:
                        # If still no JSON found, use the raw response as summary
                        summary = ai_response
                        datasets_list = []
            except (json.JSONDecodeError, AttributeError):
                # If all parsing fails, use the raw response as summary
                summary = ai_response
                datasets_list = []

        # Process datasets list to ensure consistent format and remove duplicates
        processed_datasets = []
        seen_titles = set()
        
        for dataset in datasets_list:
            # Handle different formats of dataset objects
            if isinstance(dataset, dict):
                title = dataset.get("product_title", dataset.get("title", "")).strip()
                
                # Skip if we've already seen this title (case-insensitive comparison)
                title_lower = title.lower()
                if title_lower and title_lower not in seen_titles:
                    seen_titles.add(title_lower)
                    
                    processed_dataset = {
                        "agency": dataset.get("agency", "Australian Bureau of Statistics"),
                        "title": title,
                        "release_date": dataset.get("product_release_date", dataset.get("release_date", "")),
                        "url": dataset.get("product_url", dataset.get("url", "")),
                        "topics": dataset.get("topics", []),
                    }
                    processed_datasets.append(processed_dataset)
        
        # If no datasets from AI, construct from ABS data
        if not processed_datasets and 'data' in datasets:
            abs_data = datasets['data']
            
            for series in abs_data.get('series_data', []):
                title = series.get('product_title', '').strip()
                title_lower = title.lower()
                
                # Skip if we've already seen this title
                if title_lower and title_lower not in seen_titles:
                    seen_titles.add(title_lower)
                    
                    # Get topics from metadata
                    topics = []
                    for data in context_data:
                        if data['catId'] == answer:
                            topics = data.get('topics', [])
                            break
                    
                    dataset_item = {
                        "agency": "Australian Bureau of Statistics",
                        "title": title,
                        "release_date": series.get('product_release_date', ''),
                        "url": series.get('product_url', ''),
                        "topics": topics,
                    }
                    processed_datasets.append(dataset_item)
        
        datasets_list = processed_datasets

        return AskResponse(
            answer=summary,
            datasets=datasets_list
        )
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
