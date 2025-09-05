from datetime import timedelta

from core.auth_handler import AuthHandler
from dependencies import CurrentUserDep, SessionDep, SettingsDep
from fastapi import APIRouter, HTTPException, status
from models.api_models import LoginResponse, RegisterResponse
from models.db_models import User, UserLogin, UserPublic, UserRegister
from utils.db_operations import add_user, get_user_by_email

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
async def register(form_data: UserRegister, session: SessionDep) -> RegisterResponse:

    auth_handler = AuthHandler()

    # Check if user exists
    existing_user = get_user_by_email(session, form_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        **form_data.model_dump(),
        hashed_password=auth_handler.generate_password_hash(form_data.password),
    )

    add_user(session, new_user)

    return {"message": "User registered successfully", "user": new_user.model_dump()}


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: UserLogin, session: SessionDep, settings: SettingsDep
) -> LoginResponse:

    auth_handler = AuthHandler()
    user = auth_handler.authenticate_user(form_data, session)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = auth_handler.create_access_token(
        data={"user_id": user.id}, expires_delta=access_token_expires
    )
    return {
        "message": "Login successful",
        "token": {
            "access_token": access_token,
            "token_type": "bearer",  # noqa: S106
        },
    }


@router.get("/get-current-user", response_model=UserPublic)
async def read_current_user(current_user: CurrentUserDep) -> UserPublic:
    return current_user


@router.get("/is-user-admin")
async def is_user_admin_api(current_user: CurrentUserDep, settings: SettingsDep):
    if current_user.email not in settings.admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this resource",
        )
    return {
        "is_admin": True,
        "message": "User has admin access",
        "user_email": current_user.email,
    }


# @app.patch("/heroes/{hero_id}", response_model=HeroPublic)
# def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
#     hero_db = session.get(Hero, hero_id)
#     if not hero_db:
#         raise HTTPException(status_code=404, detail="Hero not found")
#     hero_data = hero.model_dump(exclude_unset=True)
#     hero_db.sqlmodel_update(hero_data)
#     session.add(hero_db)
#     session.commit()
#     session.refresh(hero_db)
#     return hero_db
