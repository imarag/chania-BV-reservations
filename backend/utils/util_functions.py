from datetime import datetime, date, UTC


def get_naive_utc_datetime_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def get_naive_utc_date_now() -> date:
    return datetime.now(UTC).replace(tzinfo=None).date()
