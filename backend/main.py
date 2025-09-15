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


# # this is for raising httpexception errors
# @app.exception_handler(StarletteHTTPException)
# async def http_exception_handler(request, exc):
#     return JSONResponse(
#         status_code=404,
#         content={"error_message": str(exc.detail)},
#     )


# # this is for errors related to validations of pydantic
# # return the errors are comma separated strings
# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):
#     errors = exc.errors()
#     return JSONResponse(
#         status_code=400,
#         content={"error_message": ", ".join([f'{err["msg"]}' for err in errors])},
#     )


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
        host=settings.host,
        port=int(settings.port),
        use_colors=False,
        reload=True,
    )
