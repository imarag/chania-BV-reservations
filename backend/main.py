from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from core.app_paths import AppPaths
from core.db_handler import DBHandler
from dependencies import get_settings
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import authentication, database_queries
from starlette.exceptions import HTTPException as StarletteHTTPException
from utils.errors import AppError

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


# this is for raising httpexception errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    # If detail already contains our structured body, pass it through
    if isinstance(exc.detail, dict) and {"error_message", "code", "code_number", "status_code"} <= set(exc.detail):
        body = exc.detail
    else:
        # Normalize any other HTTPException to our schema
        body = {
            "error_message": str(exc.detail),
            "code": "HTTP_ERROR",
            "code_number": exc.status_code,   # simple fallback
            "status_code": exc.status_code,
        }
    return JSONResponse(status_code=exc.status_code, content=body)


# this is for errors related to validations of pydantic
# return the errors are comma separated strings
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    info = AppError.VALIDATION_ERROR.value
    # You can either join messages or return structured errors (or both)
    joined = ", ".join(err.get("msg", "Invalid value") for err in exc.errors())
    body = {
        "error_message": joined or info.detail,
        "code": info.code,
        "code_number": info.code_number,
        "status_code": info.http_status,
        "errors": exc.errors(),  # optional: keep detailed field errors
    }
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
