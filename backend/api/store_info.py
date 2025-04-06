from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import json

router = APIRouter()

# 📁 Base user storage directory
STORAGE_DIR = Path("storage/users")


# 🧼 Email to folder-safe format
def sanitize_email(email: str) -> str:
    return email.replace("@", "_at_").replace(".", "_dot_")


# 📁 Construct user-specific path
def get_user_store_path(user_email: str) -> Path:
    return STORAGE_DIR / sanitize_email(user_email) / "store_info.json"


# ✅ GET store info (requires header: x-user-email)
@router.get("/store-info")
async def get_store_info(request: Request):
    user_email = request.headers.get("x-user-email")

    if not user_email:
        print("🚫 Missing x-user-email in request headers.")
        raise HTTPException(status_code=400, detail="Missing 'x-user-email' header.")

    path = get_user_store_path(user_email)
    if not path.exists():
        print(f"ℹ️ Store info file not found for user: {user_email}")
        return JSONResponse(content={}, status_code=200)

    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Corrupted store info file.")


# ✅ POST store info (requires header: x-user-email)
@router.post("/store-info")
async def save_store_info(request: Request):
    user_email = request.headers.get("x-user-email")

    if not user_email:
        print("🚫 Missing x-user-email in POST request.")
        raise HTTPException(status_code=400, detail="Missing 'x-user-email' header.")

    try:
        data = await request.json()
        path = get_user_store_path(user_email)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        print(f"✅ Store info saved for user: {user_email}")
        return {"message": "Store info saved!"}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to save store info: {str(e)}"
        )
