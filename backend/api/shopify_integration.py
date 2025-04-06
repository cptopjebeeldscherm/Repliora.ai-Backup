# backend/api/shopify_integration.py

from fastapi import APIRouter, Request, HTTPException
from pathlib import Path
import json
from core.utils import get_user_path, get_user_email

router = APIRouter()


# ─────────────────────────────────────────────
# ✅ Save Shopify Credentials (Per User)
# ─────────────────────────────────────────────
@router.post("/shopify-credentials")
async def save_shopify_credentials(request: Request):
    user_email = get_user_email(request)
    if not user_email:
        raise HTTPException(status_code=400, detail="Missing x-user-email header")

    try:
        data = await request.json()
        shop_domain = data.get("shopDomain")
        access_token = data.get("accessToken")

        if not shop_domain or not access_token:
            raise HTTPException(
                status_code=400, detail="Missing shopDomain or accessToken"
            )

        path = get_user_path(user_email, "shopify_credentials.json")
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return {"status": "Shopify credentials saved."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# ✅ Get Shopify Credentials (Per User)
# ─────────────────────────────────────────────
@router.get("/shopify-credentials")
def get_shopify_credentials(request: Request):
    user_email = get_user_email(request)
    if not user_email:
        raise HTTPException(status_code=400, detail="Missing x-user-email header")

    path = get_user_path(user_email, "shopify_credentials.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"shopDomain": "", "accessToken": ""}
