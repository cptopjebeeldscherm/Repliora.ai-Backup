import json
import os

LOG_FILE = "replied_log.json"


def load_replied_log():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            try:
                return set(json.load(f))
            except json.JSONDecodeError:
                return set()
    return set()


def save_replied_log(log_set):
    with open(LOG_FILE, "w") as f:
        json.dump(list(log_set), f, indent=2)
