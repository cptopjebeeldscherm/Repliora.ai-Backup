# backend/core/path_utils.py

import re


def sanitize_email(email: str) -> str:
    """Convert email to a safe folder-friendly string."""
    return re.sub(r"[^\w\-]", "_", email)
