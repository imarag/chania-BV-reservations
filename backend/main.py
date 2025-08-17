from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.app_paths import AppPaths
from core.config import settings
from core.DBHandler import DatabaseHandler
from routers import authentication, database_queries


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:  # noqa: ARG001
    db_handler = DatabaseHandler()
    settings.initialize_app()
    db_handler.initialize_db()
    yield


app = FastAPI(lifespan=lifespan)

# include the routers
app.include_router(
    authentication.router, prefix=AppPaths.AUTH_API_SUFFIX.value, tags=["Auth"]
)

app.include_router(
    database_queries.router, prefix=AppPaths.DB_API_SUFFIX.value, tags=["Database"]
)

origins = ["http://0.0.0.0:8000", "http://127.0.0.1:8000", "http://localhost:4321"]

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
