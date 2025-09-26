from datetime import datetime, timedelta, UTC
from dependencies import get_settings

settings = get_settings()


def get_reservation_cutoff_utc_date():
    datetime_now = datetime.now(UTC)
    if datetime_now.hour < settings.RESERVATION_CUTOFF_HOUR:
        return (datetime_now - timedelta(days=1)).date()
    return datetime_now.date()
