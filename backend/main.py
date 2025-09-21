from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pydantic import ValidationError
from core.app_paths import AppPaths
from core.db_handler import DBHandler
from dependencies import get_settings
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import authentication, database_queries
from starlette.exceptions import HTTPException as StarletteHTTPException
from utils.errors import AppError, create_error_body, ErrorInfo


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:  # noqa: ARG001
    db_handler = DBHandler()
    db_handler.initialize_db()
    settings.initialize_app()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(authentication.router, prefix=AppPaths.AUTH_EP.value, tags=["Auth"])
app.include_router(
    database_queries.router, prefix=AppPaths.DB_EP.value, tags=["Database"]
)


# --- HTTPExceptions you raise (or Starlette raises like 404) ---
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if isinstance(exc.detail, dict):
        body = exc.detail
    else:
        # Build a generic error envelope for arbitrary HTTP errors
        temp_info = ErrorInfo(
            http_status=exc.status_code,
            code_number=exc.status_code,
            code="HTTP_ERROR",
            detail=str(exc.detail),
        )
        body = create_error_body(temp_info)
    return JSONResponse(status_code=exc.status_code, content=body)


# --- FastAPI request validation (client sent invalid data) ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Return a 422 with a joined message (human-friendly) and keep the structured
    Pydantic errors in the body for the UI to show field-level messages if needed.
    """
    info = AppError.VALIDATION_ERROR.value
    joined = ", ".join(err.get("msg", "Invalid value") for err in exc.errors())
    body = create_error_body(
        info,
        detail=joined,
        errors=exc.errors(),  # extra field with structured errors
        body=exc.body,  # may be None; useful for debugging/UX
    )
    return JSONResponse(status_code=info.http_status, content=body)


# --- Pydantic validation inside your code/response models (server-side bug) ---
@app.exception_handler(ValidationError)
async def pydantic_validation_handler(request: Request, exc: ValidationError):
    info = AppError.SERVER_ERROR.value
    body = create_error_body(
        info,
        detail="Internal validation error",
        errors=exc.errors(),
        exception="ValidationError",
    )
    return JSONResponse(status_code=info.http_status, content=body)


# --- Any other uncaught exception (catch-all 500) ---
@app.exception_handler(Exception)
async def generic_handler(request: Request, exc: Exception):
    info = AppError.SERVER_ERROR.value
    body = create_error_body(
        info,
        detail="Something went wrong",
        exception=type(exc).__name__,
    )
    return JSONResponse(status_code=info.http_status, content=body)


origins = [
    "http://0.0.0.0:8000",
    "http://127.0.0.1:8000",
    "http://localhost:4321",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        use_colors=False,
        reload=True,
    )
