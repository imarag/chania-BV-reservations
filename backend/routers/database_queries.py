from fastapi import APIRouter
from dependencies import SessionDep
from utils.db_operations import (
    get_users,
    get_courts,
    get_time_slots,
    get_reservations,
    get_user_by_email,
    get_user_by_id,
    get_court_by_id,
    get_time_slot_by_id,
    get_reservation_by_id,
)
from models.db import Court, TimeSlot, Reservation, User

router = APIRouter()


@router.get("/users")
async def get_all_users_route(session: SessionDep) -> list:
    return get_users(session)


@router.get("/courts")
async def get_all_courts_route(session: SessionDep) -> list:
    return get_courts(session)


@router.get("/time-slots")
async def get_all_time_slots_route(session: SessionDep) -> list:
    return get_time_slots(session)


@router.get("/reservations")
async def get_all_reservations_route(session: SessionDep) -> list:
    return get_reservations(session)


@router.get("/get-user-by-email")
async def get_user_by_email_route(email: str, session: SessionDep) -> User | None:
    return get_user_by_email(session, email)


@router.get("/get-user-by-id")
async def get_user_by_id_route(user_id: str, session: SessionDep) -> User | None:
    return get_user_by_id(session, user_id)


@router.get("/get-court-by-id")
async def get_court_by_id_route(court_id: str, session: SessionDep) -> Court | None:
    return get_court_by_id(session, court_id)


@router.get("/get-time-slot-by-id")
async def get_time_slot_by_id_route(
    time_slot_id: str, session: SessionDep
) -> TimeSlot | None:
    return get_time_slot_by_id(session, time_slot_id)


@router.get("/get-reservation-by-id")
async def get_reservation_by_id_route(
    reservation_id: str, session: SessionDep
) -> Reservation | None:
    return get_reservation_by_id(session, reservation_id)
