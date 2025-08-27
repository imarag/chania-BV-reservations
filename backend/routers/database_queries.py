from fastapi import APIRouter

from dependencies import SessionDep
from models.db_models import Court, Reservation, ReservationUser, TimeSlot
from models.db_models import UserPublic
# from utils.db_operations import (
#     get_court_by_id,
#     get_court_by_name,
#     get_courts,
#     get_reservation_by_id,
#     get_reservation_players,
#     get_reservations,
#     get_time_slot_by_id,
#     get_time_slots,
#     get_user_by_email,
#     get_user_by_id,
#     get_users,
# )

router = APIRouter()


# @router.get("/users")
# async def get_all_users_route(session: SessionDep) -> list[UserPublic]:
#     users = get_users(session)
#     return [UserPublic(**user.model_dump()) for user in users]


# @router.get("/courts")
# async def get_all_courts_route(session: SessionDep) -> list[Court]:
#     return get_courts(session)


# @router.get("/time-slots")
# async def get_all_time_slots_route(session: SessionDep) -> list[TimeSlot]:
#     return get_time_slots(session)


# @router.get("/reservations")
# async def get_all_reservations_route(session: SessionDep) -> list[Reservation]:
#     return get_reservations(session)


# @router.get("/reservation-players")
# async def get_all_reservation_players_route(
#     session: SessionDep,
# ) -> list[ReservationUser]:
#     return get_reservation_players(session)


# @router.get("/get-user-by-email")
# async def get_user_by_email_route(email: str, session: SessionDep) -> UserPublic | None:
#     user = get_user_by_email(session, email)
#     return UserPublic(**user.model_dump()) if user else None


# @router.get("/get-user-by-id")
# async def get_user_by_id_route(user_id: int, session: SessionDep) -> UserPublic | None:
#     user = get_user_by_id(session, user_id)
#     return UserPublic(**user.model_dump()) if user else None


# @router.get("/get-court-by-id")
# async def get_court_by_id_route(court_id: int, session: SessionDep) -> Court | None:
#     return get_court_by_id(session, court_id)


# @router.get("/get-court-by-name")
# async def get_court_by_name_route(court_name: str, session: SessionDep) -> Court | None:
#     return get_court_by_name(session, court_name)


# @router.get("/get-time-slot-by-id")
# async def get_time_slot_by_id_route(
#     time_slot_id: int, session: SessionDep
# ) -> TimeSlot | None:
#     return get_time_slot_by_id(session, time_slot_id)


# @router.get("/get-reservation-by-id")
# async def get_reservation_by_id_route(
#     reservation_id: int, session: SessionDep
# ) -> Reservation | None:
#     return get_reservation_by_id(session, reservation_id)
