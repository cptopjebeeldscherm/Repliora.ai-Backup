from apscheduler.schedulers.background import BackgroundScheduler
from core.email_bot import check_and_reply_to_emails
from pathlib import Path
import json

scheduler = BackgroundScheduler()

# -------------------- Config Paths --------------------
SYNC_FILE = (
    Path(__file__).resolve().parent.parent / "config" / "auto_sync_settings.json"
)
SCHEDULE_FILE = (
    Path(__file__).resolve().parent.parent / "config" / "auto_reply_schedule.json"
)


# -------------------- Auto-Sync Logic --------------------
def save_sync_settings(enabled: bool, interval: int):
    with open(SYNC_FILE, "w") as f:
        json.dump({"enabled": enabled, "interval": interval}, f, indent=2)


def start_auto_sync_job(interval_minutes=15):
    scheduler.add_job(
        func=check_and_reply_to_emails,
        trigger="interval",
        minutes=interval_minutes,
        id="email_auto_sync",
        replace_existing=True,
    )
    scheduler.start()
    save_sync_settings(enabled=True, interval=interval_minutes)
    print(f"🔁 Auto-sync enabled every {interval_minutes} minutes.")


def stop_auto_sync_job():
    try:
        scheduler.remove_job("email_auto_sync")
        save_sync_settings(enabled=False, interval=15)
        print("🛑 Auto-sync job stopped.")
    except Exception as e:
        print("⚠️ Failed to stop sync job:", e)


# -------------------- Auto-Reply Scheduling Logic --------------------
def save_schedule_settings(enabled: bool, start: str, end: str):
    with open(SCHEDULE_FILE, "w") as f:
        json.dump({"enabled": enabled, "start": start, "end": end}, f, indent=2)


def start_auto_reply_schedule(interval_minutes=15):
    scheduler.add_job(
        func=check_and_reply_to_emails,
        trigger="interval",
        minutes=interval_minutes,
        id="email_auto_reply",
        replace_existing=True,
    )
    scheduler.start()
    print(f"⏰ Auto-reply job scheduled every {interval_minutes} minutes.")
