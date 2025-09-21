from dataclasses import dataclass, asdict
from enum import Enum
from fastapi import HTTPException
from typing import NoReturn

# ---------- Core definitions ----------


@dataclass(frozen=True)
class ErrorInfo:
    http_status: int
    code_number: int
    code: str  # machine-readable string (e.g., "NOT_FOUND")
    detail: str  # default human-readable message


class AppError(Enum):
    # 422 — request/body validation failed (Pydantic or your own checks)
    VALIDATION_ERROR = ErrorInfo(
        422, 3002, "VALIDATION_ERROR", "Request validation failed"
    )

    # 409 — unique constraint or duplicate resource (e.g., email already used)
    EMAIL_ALREADY_REGISTERED = ErrorInfo(
        409, 4001, "EMAIL_ALREADY_REGISTERED", "Email already registered"
    )

    # 401 — unauthenticated (no/invalid/expired session)
    INVALID_CREDENTIALS = ErrorInfo(
        401, 1001, "INVALID_CREDENTIALS", "Incorrect email or password"
    )
    SESSION_EXPIRED = ErrorInfo(401, 1002, "SESSION_EXPIRED", "Session expired")
    MISSING_SESSION = ErrorInfo(401, 1003, "MISSING_SESSION", "Please log in")

    # 403 — authenticated but not allowed
    NOT_AUTHORIZED = ErrorInfo(403, 2002, "NOT_AUTHORIZED", "You do not have access")
    RESERVATION_NOT_ALLOWED = ErrorInfo(
        403,
        2003,
        "RESERVATION_NOT_ALLOWED",
        "User is not allowed to make a reservation",
    )

    # 404 — resource doesn’t exist
    NOT_FOUND = ErrorInfo(404, 4004, "NOT_FOUND", "Resource not found")

    # 409 — generic conflict bucket
    CONFLICT = ErrorInfo(409, 4009, "CONFLICT", "Resource conflict")

    # 500 — generic server failure
    SERVER_ERROR = ErrorInfo(500, 5000, "SERVER_ERROR", "Internal server error")


# ---------- Reusable builder ----------


def create_error_body(
    err: AppError | ErrorInfo,
    detail: str | None = None,
    **extra_fields: dict | None,
) -> dict:
    info = err.value if isinstance(err, AppError) else err
    body = asdict(info)

    if detail is not None:
        body["detail"] = detail

    # duplicate http_status in body for convenience
    body["status"] = info.http_status

    # merge any extra fields
    body.update(extra_fields)

    return body


def raise_app_error(
    err: AppError,
    detail: str | None = None,  # overwrite error message
    **extra_fields: dict | None,  # add extra fields
) -> NoReturn:
    info = err.value
    body = create_error_body(info, detail=detail, **extra_fields)
    raise HTTPException(status_code=info.http_status, detail=body)
