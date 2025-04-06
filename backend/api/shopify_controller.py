from fastapi import APIRouter
from core.shopify import get_order_by_email, get_shipping_status

router = APIRouter()


@router.get("/test-order-by-email")
def test_order(email: str):
    orders = get_order_by_email(email)
    return {"orders": orders}


@router.get("/test-shipping-status")
def test_shipping_by_name(order_id: str):
    from core.shopify import load_credentials
    import requests

    domain, token = load_credentials()
    url = f"https://{domain}/admin/api/2023-07/orders.json?status=any"
    headers = {"X-Shopify-Access-Token": token, "Content-Type": "application/json"}

    res = requests.get(url, headers=headers)
    if res.status_code != 200:
        return {"error": "Failed to fetch orders", "status": res.status_code}

    orders = res.json().get("orders", [])

    for order in orders:
        if order.get("name") == order_id:
            from core.shopify import get_shipping_status

            tracking_info = get_shipping_status(order["id"])

            return {
                "shopify_id": order["id"],
                "name": order["name"],
                "shipping_status": order["fulfillment_status"],
                "financial_status": order["financial_status"],
                "tracking_info": tracking_info,  # ✅ Now included
                "customer_email": order["email"],
                "customer_name": f"{order['customer']['first_name']} {order['customer']['last_name']}",
                "shipping_address": order.get("shipping_address"),
                "line_items": order.get("line_items"),
            }

    return {"detail": f"Order name {order_id} not found."}
