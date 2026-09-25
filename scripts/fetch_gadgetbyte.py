#!/usr/bin/env python3
"""
GadgetByte Nepal Data Ingestion Script
Fetches live mobile model names, variants, and NPR prices from GadgetByte Nepal endpoints
and outputs a structured data/products.json for the Nepal Mobile Store storefront.
"""

import os
import re
import json
import urllib.request

SOURCES = [
    {
        "brand": "Apple",
        "url": "https://www.gadgetbytenepal.com/apple-iphone-price-nepal/",
        "default_image": "ios.jpg",
        "category": "Flagship"
    },
    {
        "brand": "Samsung",
        "url": "https://www.gadgetbytenepal.com/samsung-mobiles-price-nepal/",
        "default_image": "s25.jpg",
        "category": "Flagship & Midrange"
    },
    {
        "brand": "Xiaomi",
        "url": "https://www.gadgetbytenepal.com/xiaomi-mobiles-price-in-nepal/",
        "default_image": "p50.jpg",
        "category": "Midrange & Budget"
    },
    {
        "brand": "OnePlus",
        "url": "https://www.gadgetbytenepal.com/oneplus-mobiles-price-nepal/",
        "default_image": "p50.jpg",
        "category": "Flagship Killer"
    },
    {
        "brand": "Nothing",
        "url": "https://www.gadgetbytenepal.com/nothing-phones-price-nepal/",
        "default_image": "ios.jpg",
        "category": "Design & Innovation"
    },
    {
        "brand": "Nokia",
        "url": "https://www.gadgetbytenepal.com/nokia-mobiles-price-nepal/",
        "default_image": "nokia.jpg",
        "category": "Budget & Classic"
    }
]

def fetch_page(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Warning: Failed to fetch {url}: {e}")
        return ""

def parse_price(price_str):
    # Extracts first integer from price string like "NPR 242,499 (256GB)" or "NPR 184,999"
    match = re.search(r'NPR\s*([\d,]+)', price_str, re.IGNORECASE)
    if not match:
        match = re.search(r'([\d,]+)', price_str)
    if match:
        num = match.group(1).replace(',', '')
        try:
            return int(num)
        except ValueError:
            return 0
    return 0

def parse_brand_data(source):
    brand = source["brand"]
    url = source["url"]
    html = fetch_page(url)
    if not html:
        return []

    products = []
    # Find all table rows
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
    current_model = ""

    for r in rows:
        cols = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        if len(cols) >= 2:
            cell0, cell1 = cols[0], cols[1]
            if "Model" in cell0 or "Price" in cell1 or "Updated" in cell1 or "Mobiles" in cell0:
                continue

            if cell0 and not cell0.startswith("NPR") and not cell0.startswith("Rs"):
                current_model = cell0

            price_val = parse_price(cell1)
            if price_val > 0:
                model_name = current_model if current_model else brand + " Phone"
                # Extract variant info if present, e.g., "(256GB)" or "(12+256GB)"
                variant_match = re.search(r'\(([^)]+)\)', cell1)
                variant = variant_match.group(1) if variant_match else ""

                product_id = re.sub(r'[^a-z0-9]+', '-', f"{model_name}-{variant}".lower()).strip('-')
                
                # Mock high-resolution specs based on price segment
                ram = "12GB" if price_val > 150000 else ("8GB" if price_val > 40000 else "4GB")
                storage = variant if ("GB" in variant or "TB" in variant) else ("256GB" if price_val > 100000 else "128GB")

                products.append({
                    "id": product_id,
                    "brand": brand,
                    "model": model_name,
                    "variant": variant,
                    "price_npr": price_val,
                    "formatted_price": f"NPR {price_val:,}",
                    "category": source["category"],
                    "image": source["default_image"],
                    "specs": {
                        "display": "Dynamic AMOLED 120Hz" if price_val > 80000 else "6.6\" FHD+ 90Hz",
                        "processor": "Flagship Octa-Core" if price_val > 100000 else "Octa-Core Processor",
                        "ram": ram,
                        "storage": storage,
                        "camera": "50MP Triple Camera + OIS" if price_val > 50000 else "50MP AI Dual Camera",
                        "battery": "5000 mAh Fast Charge"
                    },
                    "tag": "Best Seller" if price_val > 200000 else ("Popular" if price_val > 50000 else "Budget Choice"),
                    "in_stock": True
                })

    return products

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "data")
    os.makedirs(data_dir, exist_ok=True)
    out_file = os.path.join(data_dir, "products.json")

    print("Fetching live data from GadgetByte Nepal...")
    all_products = []
    seen_ids = set()

    for src in SOURCES:
        print(f"Processing brand: {src['brand']}...")
        brand_items = parse_brand_data(src)
        for item in brand_items:
            if item["id"] not in seen_ids:
                seen_ids.add(item["id"])
                all_products.append(item)

    # Add fallback classic models from original project if not present
    classic_models = [
        {
            "id": "iphone-16-pro-max-original",
            "brand": "Apple",
            "model": "Iphone 16 Pro Max",
            "variant": "256GB",
            "price_npr": 308000,
            "formatted_price": "NPR 308,000",
            "category": "Flagship",
            "image": "ios.jpg",
            "specs": {
                "display": "6.9\" Super Retina XDR OLED 120Hz",
                "processor": "Apple A18 Pro",
                "ram": "8GB",
                "storage": "256GB",
                "camera": "48MP Fusion Triple Camera",
                "battery": "4685 mAh"
            },
            "tag": "Best Seller",
            "in_stock": True
        },
        {
            "id": "samsung-s25-ultra-original",
            "brand": "Samsung",
            "model": "Samsung Galaxy s25 Ultra",
            "variant": "512GB",
            "price_npr": 250000,
            "formatted_price": "NPR 250,000",
            "category": "Flagship",
            "image": "s25.jpg",
            "specs": {
                "display": "6.8\" Dynamic AMOLED 2X 120Hz",
                "processor": "Snapdragon 8 Gen 4 for Galaxy",
                "ram": "12GB",
                "storage": "512GB",
                "camera": "200MP Quad Camera",
                "battery": "5000 mAh"
            },
            "tag": "Top Rated",
            "in_stock": True
        },
        {
            "id": "huawei-p50-pro-original",
            "brand": "Huawei",
            "model": "Huawei P50 Pro",
            "variant": "256GB",
            "price_npr": 200000,
            "formatted_price": "NPR 200,000",
            "category": "Premium",
            "image": "p50.jpg",
            "specs": {
                "display": "6.6\" OLED 120Hz",
                "processor": "Snapdragon 888 4G",
                "ram": "8GB",
                "storage": "256GB",
                "camera": "50MP True-Chroma Quad Camera",
                "battery": "4360 mAh"
            },
            "tag": "Classic",
            "in_stock": True
        },
        {
            "id": "nokia-3300-original",
            "brand": "Nokia",
            "model": "Nokia 3300",
            "variant": "Standard",
            "price_npr": 10000,
            "formatted_price": "NPR 10,000",
            "category": "Classic Feature",
            "image": "nokia.jpg",
            "specs": {
                "display": "1.7\" Color Display",
                "processor": "Symbian OS",
                "ram": "64MB",
                "storage": "64MB + MMC Expansion",
                "camera": "N/A",
                "battery": "830 mAh Removable"
            },
            "tag": "Legendary",
            "in_stock": True
        }
    ]

    for cm in classic_models:
        if cm["id"] not in seen_ids:
            seen_ids.add(cm["id"])
            all_products.append(cm)

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {out_file} with {len(all_products)} products!")

if __name__ == "__main__":
    main()
