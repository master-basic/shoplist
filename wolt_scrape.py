import os
import sys
import csv
import json
import requests
from datetime import datetime
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

VENUE_SLUG = "bravo-supermarket-mardakan-shosessi"
OUTPUT_DIR = os.path.join("findings", "scrapper")
CSV_PATH = os.path.join(OUTPUT_DIR, "products.csv")
JSON_PATH = os.path.join(OUTPUT_DIR, "products.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}

def get_session():
    session = requests.Session()
    retries = Retry(total=3, backoff_factor=2, status_forcelist=[500, 502, 503, 504])
    session.mount("https://", HTTPAdapter(max_retries=retries))
    session.headers.update(HEADERS)
    return session

def scrape():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    session = get_session()
    
    url1 = f"https://consumer-api.wolt.com/consumer-api/consumer-assortment/v1/venues/slug/{VENUE_SLUG}/assortment?language=en"
    try:
        resp = session.get(url1, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            # Debugging: Check if items list is empty and what categories look like
            # The prompt says items are in a list. 
            # If data['items'] is empty, maybe they are in categories.
            process_data(data)
            return
    except Exception:
        pass

    url2 = f"https://restaurant-api.wolt.com/v4/venues/slug/{VENUE_SLUG}/menu?unit_prices=true"
    try:
        resp = session.get(url2, timeout=30)
        if resp.status_code == 200:
            process_data(resp.json())
            return
        else:
            print(f"Both APIs failed. Status: {resp.status_code}")
            sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

def process_data(data):
    processed_items = []
    seen_item_ids = set()
    
    # In consumer-api, 'items' is often the source of truth, but it might be empty 
    # if the response is paginated or if it's a different version.
    # However, 'categories' contain 'item_ids'.
    
    # Let's try to build the items map from whatever is available.
    # If 'items' is empty, maybe we need to find items via other means or they are in categories.
    # Wait, if 'items' is empty in the JSON, where are the details?
    # Let's check if 'items' exists and has content.
    
    items_map = {}
    if "items" in data and data["items"]:
        for it in data["items"]:
            if "id" in it:
                items_map[it["id"]] = it
    
    categories = data.get("categories", [])
    
    # If items_map is still empty, maybe we need to fetch items differently or the API is different.
    # But let's follow the structure: categories have item_ids.
    # If items_map is empty, it means the 'items' key in the root was empty.
    # In some Wolt API versions, the items are nested or provided in a way that requires 
    # another call, but the prompt says "Fetch the assortment" and "Parse the JSON".
    
    # Let's check if items are actually inside categories as objects in some cases.
    for cat in categories:
        cat_slug = cat.get("slug", "")
        if cat_slug.startswith("3-al"):
            continue
            
        cat_name = cat.get("name", "")
        
        # Try multiple ways to get items from category
        cat_items_list = []
        if "item_ids" in cat:
            # it's a list of IDs
            cat_items_list = cat["item_ids"]
        elif "items" in cat:
            # it might be a list of item objects
            cat_items_list = cat["items"]
            
        for it_ref in cat_items_list:
            it_id = None
            it_obj = None
            
            if isinstance(it_ref, str) or isinstance(it_ref, int):
                it_id = it_ref
                it_obj = items_map.get(it_id)
            elif isinstance(it_ref, dict):
                it_id = it_ref.get("id")
                it_obj = it_ref
            
            if not it_id or it_id in seen_item_ids:
                continue
                
            # Use the object from category if items_map doesn't have it
            item_data = it_obj if it_obj else items_map.get(it_id)
            
            if not item_data:
                continue

            price = item_data.get("price", 0) / 100.0
            orig_price = item_data.get("original_price")
            orig_price_val = (orig_price / 100.0) if orig_price is not None else ""
            
            unit_info = item_data.get("unit_info") or item_data.get("unit_price", "")
            
            processed_items.append({
                "category": cat_name,
                "name": item_data.get("name", ""),
                "price_azn": f"{price:.2f}",
                "original_price_azn": f"{orig_price_val:.2f}" if isinstance(orig_price_val, float) else "",
                "unit_info": unit_info,
                "item_id": it_id
            })
            seen_item_ids.add(it_id)

    # If still nothing, try the top-level items if they were indeed there
    if not processed_items and items_map:
        for it_id, item_data in items_map.items():
            if it_id in seen_item_ids: continue
            price = item_data.get("price", 0) / 100.0
            orig_price = item_data.get("original_price")
            orig_price_val = (orig_price / 100.0) if orig_price is not None else ""
            unit_info = item_data.get("unit_info") or item_data.get("unit_price", "")
            processed_items.append({
                "category": "Uncategorized",
                "name": item_data.get("name", ""),
                "price_azn": f"{price:.2f}",
                "original_price_azn": f"{orig_price_val:.2f}" if isinstance(orig_price_val, float) else "",
                "unit_info": unit_info,
                "item_id": it_id
            })
            seen_item_ids.add(it_id)

    with open(CSV_PATH, mode="w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["category", "name", "price_azn", "original_price_azn", "unit_info", "item_id"])
        writer.writeheader()
        writer.writerows(processed_items)

    with open(JSON_PATH, mode="w", encoding="utf-8") as f:
        json.dump(processed_items, f, ensure_ascii=False, indent=2)

    unique_cats = len(set(i["category"] for i in processed_items))
    print(f"Total categories: {unique_cats}")
    print(f"Total items: {len(processed_items)}")
    print("Sample rows:")
    for i in processed_items[:3]:
        print(f"  {i}")
    print(f"Files written: {os.path.abspath(CSV_PATH)}, {os.path.abspath(JSON_PATH)}")

if __name__ == "__main__":
    scrape()
