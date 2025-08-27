from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.app_paths import AppPaths
from dependencies import get_settings
from core.db_handler import DBHandler
from routers import authentication, database_queries

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:  # noqa: ARG001
    db_handler = DBHandler()
    db_handler.initialize_db()
    settings.initialize_app()
    yield


app = FastAPI(lifespan=lifespan)

# include the routers
app.include_router(
    authentication.router, prefix=AppPaths.AUTH_EP.value, tags=["Auth"]
)

app.include_router(
    database_queries.router, prefix=AppPaths.DB_EP.value, tags=["Database"]
)

origins = ["http://0.0.0.0:8000", "http://127.0.0.1:8000", "http://localhost:4321"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from dependencies import CurrentUserDep
from typing import Annotated
from fastapi import Depends
@app.get("/current_user")
async def get_current_user(curr_user: CurrentUserDep):
    return curr_user


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=int(settings.port),
        use_colors=False,
        reload=True,
    )
