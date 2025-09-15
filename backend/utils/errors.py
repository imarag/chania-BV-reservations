from dataclasses import dataclass
from enum import Enum
from fastapi import HTTPException
from typing import NoReturn, Optional, Dict, Any


@dataclass(frozen=True)
class ErrorInfo:
    http_status: int
    code_number: int
    code: str          # machine-readable string
    detail: str        # default human-readable message


class AppError(Enum):
    # 422 — request/body validation failed (Pydantic or your own checks)
    VALIDATION_ERROR = ErrorInfo(422, 3002, "VALIDATION_ERROR", "Request validation failed")

    # 409 — unique constraint or duplicate resource (e.g., email already used)
    EMAIL_ALREADY_REGISTERED = ErrorInfo(409, 4009, "EMAIL_ALREADY_REGISTERED", "Email already registered")

    # 401 — unauthenticated (no/invalid/expired session)
    INVALID_CREDENTIALS = ErrorInfo(401, 1001, "INVALID_CREDENTIALS", "Incorrect email or password")
    SESSION_EXPIRED     = ErrorInfo(401, 1002, "SESSION_EXPIRED", "Session expired")
    MISSING_SESSION     = ErrorInfo(401, 1003, "MISSING_SESSION", "Please log in")

    # 403 — authenticated but not allowed (e.g., non-admin to admin route)
    NOT_AUTHORIZED = ErrorInfo(403, 2002, "NOT_AUTHORIZED", "You do not have access")

    # 404 — resource doesn’t exist (e.g., user/reservation not found)
    NOT_FOUND = ErrorInfo(404, 4004, "NOT_FOUND", "Resource not found")

    # 409 — generic conflict bucket
    CONFLICT = ErrorInfo(409, 4009, "CONFLICT", "Resource conflict")

    # 500 — generic server failure (unexpected exceptions)
    SERVER_ERROR = ErrorInfo(500, 5000, "SERVER_ERROR", "Internal server error")


def raise_app_error(
    err: AppError,
    *,
    detail: Optional[str] = None,         # override default human message
    extra: Optional[Dict[str, Any]] = None,  # attach extra payload fields
) -> NoReturn:
    info = err.value
    body = {
        "error_message": detail or info.detail,
        "code": info.code,
        "code_number": info.code_number,
        "status_code": info.http_status
    }
    if extra:
        body.update(extra)
    raise HTTPException(status_code=info.http_status, detail=body)
