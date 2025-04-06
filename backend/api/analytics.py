# backend/api/analytics.py

from fastapi import APIRouter, Request, HTTPException
from core.utils import get_user_path, get_user_email
import json
from datetime import datetime, timedelta

router = APIRouter()

# Default stats to start with if file doesn't exist
DEFAULT_STATS = {
    "total_emails_processed": 0,
    "total_replied": 0,
    "total_unanswered": 0,
    "average_confidence": 0,
}

DEFAULT_FAQS = [
    {"question": "How long does shipping take?", "category": "Orders"},
    {"question": "Can I track my order?", "category": "Orders"},
    {"question": "Do you offer international shipping?", "category": "Shipping"},
    {"question": "What if I receive the wrong item?", "category": "Returns"},
    {"question": "Do you accept returns or exchanges?", "category": "Returns"},
    {"question": "Can I cancel my order?", "category": "Orders"},
    {"question": "What if my order is delayed?", "category": "Shipping"},
    {"question": "Can I change my shipping address?", "category": "Orders"},
    {"question": "Which payment methods do you accept?", "category": "General"},
    {
        "question": "Will I get a confirmation email after ordering?",
        "category": "General",
    },
    {"question": "What happens if my package gets lost?", "category": "Shipping"},
    {"question": "Is my payment information secure?", "category": "General"},
    {"question": "How do I know my order went through?", "category": "Orders"},
    {"question": "What is your return policy?", "category": "Returns"},
    {"question": "When will my refund be processed?", "category": "Returns"},
    {
        "question": "Can I exchange for a different size or color?",
        "category": "Returns",
    },
    {"question": "Do you provide order updates?", "category": "Orders"},
    {"question": "What courier do you use?", "category": "Shipping"},
    {"question": "Do you ship to PO Boxes?", "category": "Shipping"},
    {"question": "Can I add items to an order I just placed?", "category": "Orders"},
]


# ✅ Load user-specific analytics data
def load_analytics_data(user_email: str):
    path = get_user_path(user_email, "analytics.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return DEFAULT_STATS.copy()
    return DEFAULT_STATS.copy()


# ✅ Save user-specific analytics data
def save_analytics_data(user_email: str, data: dict):
    path = get_user_path(user_email, "analytics.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ✅ Load user-specific chart data
def load_chart_data(user_email: str):
    path = get_user_path(user_email, "chart_data.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []


# ✅ Save user-specific chart data
def save_chart_data(user_email: str, chart_data: list):
    path = get_user_path(user_email, "chart_data.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(chart_data, f, indent=2)


# ✅ Load user-specific FAQ data
def initialize_faq_if_empty(user_email: str):
    path = get_user_path(user_email, "faqs.json")
    if not path.exists():
        with open(path, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_FAQS, f, indent=2)


# ✅ GET endpoint for retrieving analytics per user
@router.get("/get-analytics")
def get_analytics(request: Request):
    user_email = get_user_email(request)
    initialize_faq_if_empty(user_email)

    analytics = load_analytics_data(user_email)
    chart = load_chart_data(user_email)

    # Adjust Y-Axis max dynamically for frontend (e.g. round up to next 100 or 1000)
    max_processed = max((entry["processed"] for entry in chart), default=0)
    chart_y_max = 100 if max_processed == 0 else ((max_processed // 100 + 1) * 100)

    return {
        **analytics,
        "chart": chart,
        "chart_y_max": chart_y_max,
    }


# ✅ Function to update analytics (used internally by the bot)
def update_analytics(new_data: dict, user_email: str):
    print("✅ update_analytics called with:", new_data)

    data = load_analytics_data(user_email)

    data["total_emails_processed"] += new_data.get("total_emails_processed", 0)
    data["total_replied"] += new_data.get("total_replied", 0)
    data["total_unanswered"] += new_data.get("total_unanswered", 0)

    new_score = new_data.get("average_confidence", 0)
    count = data["total_emails_processed"]
    if count > 0:
        prev_avg = data["average_confidence"]
        updated_avg = ((prev_avg * (count - 1)) + new_score) / count
        data["average_confidence"] = round(updated_avg, 2)

    save_analytics_data(user_email, data)

    # 🔁 Update chart
    chart = load_chart_data(user_email)
    today = datetime.utcnow().strftime("%Y-%m-%d")

    # Check if today's entry exists
    existing_entry = next((entry for entry in chart if entry["date"] == today), None)
    if existing_entry:
        existing_entry["processed"] += new_data.get("total_emails_processed", 0)
        existing_entry["replied"] += new_data.get("total_replied", 0)
        existing_entry["confidence"] = round(
            (
                (existing_entry["confidence"] + new_data.get("average_confidence", 0))
                / 2
            ),
            2,
        )
    else:
        chart.append(
            {
                "date": today,
                "processed": new_data.get("total_emails_processed", 0),
                "replied": new_data.get("total_replied", 0),
                "confidence": round(new_data.get("average_confidence", 0), 2),
            }
        )

    # Keep only last 14 days
    chart = sorted(chart, key=lambda x: x["date"])[-14:]
    save_chart_data(user_email, chart)
