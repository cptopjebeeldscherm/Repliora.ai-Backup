import requests
import json
from pathlib import Path

SHOPIFY_CREDENTIALS = (
    Path(__file__).resolve().parent.parent / "config" / "shopify_credentials.json"
)


def load_credentials():
    if not SHOPIFY_CREDENTIALS.exists():
        raise FileNotFoundError("❌ Shopify credentials file not found.")

    with open(SHOPIFY_CREDENTIALS, "r") as f:
        creds = json.load(f)

    if "shop_domain" not in creds or "access_token" not in creds:
        raise KeyError(
            "❌ Missing 'shop_domain' or 'access_token' in credentials file."
        )

    return creds["shop_domain"], creds["access_token"]


def get_order_by_email(email):
    try:
        shop_domain, access_token = load_credentials()
    except Exception as e:
        return {"error": str(e)}

    url = f"https://{shop_domain}/admin/api/2023-07/orders.json?email={email}"

    headers = {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        orders = response.json().get("orders", [])
        return orders
    else:
        print("❌ Failed to fetch orders:", response.text)
        return {"error": response.text}


def get_shipping_status(order_id):
    shop_domain, access_token = load_credentials()
    url = f"https://{shop_domain}/admin/api/2023-07/orders/{order_id}/fulfillments.json"

    headers = {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        fulfillments = response.json().get("fulfillments", [])

        if fulfillments:
            fulfillment = fulfillments[0]  # use first fulfillment for simplicity
            tracking_info = {
                "tracking_number": fulfillment.get("tracking_number"),
                "tracking_url": fulfillment.get("tracking_url"),
                "tracking_company": fulfillment.get("tracking_company"),
                "status": fulfillment.get("shipment_status"),
            }
            return tracking_info

        return {"status": "fulfilled", "tracking_info": None}

    print("❌ Failed to fetch shipping status:", response.text)
    return {"error": "API call failed", "status_code": response.status_code}
