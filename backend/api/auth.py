from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import json
import hashlib

router = APIRouter()

# ✅ FIXED: Always resolve relative to project root
BASE_DIR = Path(__file__).resolve().parents[1]  # <- one level above /api
USERS_DIR = BASE_DIR / "storage" / "users"
USERS_FILE = USERS_DIR / "users.json"
USERS_DIR.mkdir(parents=True, exist_ok=True)

if not USERS_FILE.exists():
    USERS_FILE.write_text("{}")


def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def sanitize_email(email: str) -> str:
    return email.replace("@", "_at_").replace(".", "_dot_")


def load_users() -> dict:
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(data: dict):
    with open(USERS_FILE, "w") as f:
        json.dump(data, f, indent=2)


class RegisterUser(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(user: RegisterUser):
    users = load_users()

    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")

    user_data = {
        "email": user.email,
        "password": hash_password(user.password),
        "role": "user",
    }

    users[user.email] = user_data
    save_users(users)

    folder = USERS_DIR / sanitize_email(user.email)
    folder.mkdir(parents=True, exist_ok=True)

    return {"message": "User registered", "user_id": user.email, "role": "user"}


class LoginUser(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(user: LoginUser):
    users = load_users()
    stored_user = users.get(user.email)

    if not stored_user:
        raise HTTPException(status_code=404, detail="User not found")
    if stored_user["password"] != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": user.email,
        "role": stored_user.get("role", "user"),
    }


@router.get("/admin/users")
def get_users():
    users = load_users()
    return [{"email": k, **v} for k, v in users.items()]
