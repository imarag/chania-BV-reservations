import time
from fastapi import APIRouter, Body
from typing import Annotated
from core.auth_handler import AuthHandler
from dependencies import SessionDep
from models.db_models import (
    UserPublic,
    CourtPublic,
    TimeSlotPublic,
    ReservationPublic,
    ReservationUserPublic,
    UserUpdate,
    ReservationCreate,
)
from utils.db_operations import (
    get_courts,
    get_time_slots,
    get_reservations,
    get_reservation_players,
    get_users,
    update_user,
    delete_user,
    add_reservation,
    add_reservation_users,
)

router = APIRouter()


@router.get("/get-booking-cells")
async def get_booking_cells(session: SessionDep) -> dict:

    # Fetch all courts, timeslots, reservations, and reservation_players
    all_users = get_users(session)
    all_courts = get_courts(session)
    all_timeslots = get_time_slots(session)
    reservations = get_reservations(session)
    reservation_players = get_reservation_players(session)

    # Dictionary mapping: user_id -> user details
    user_map = {u.id: u for u in all_users}

    # Dictionary mapping: reservation_id -> list of user_ids
    reservation_players_map = {}
    print(user_map)
    for rp in reservation_players:
        user_id = rp.user_id
        reservation_id = rp.reservation_id

        if reservation_id not in reservation_players_map:
            reservation_players_map[rp.reservation_id] = [
                UserPublic(**user_map[user_id].model_dump())
            ]
        else:
            reservation_players_map[rp.reservation_id].append(
                UserPublic(**user_map[user_id].model_dump())
            )

    # Dictionary mapping: (court_id, timeslot_id) -> reservation
    reservation_map = {(r.court_id, r.timeslot_id): r for r in reservations}

    # Build flattened schedule cells
    schedule_cells = {
        "courts": [CourtPublic(**c.model_dump()) for c in all_courts],
        "timeslots": [TimeSlotPublic(**t.model_dump()) for t in all_timeslots],
        "bookings": {},
    }
    for t in all_timeslots:
        for c in all_courts:
            booking_id = f"{c.id}-{t.id}"
            cell = {}

            # Check if this (court_id, timeslot_id) is booked
            r = reservation_map.get((c.id, t.id))
            if r is not None:
                cell["booking_user"] = user_map[
                    r.user_id
                ].full_name  # The user who made the reservation
                cell["reservation"] = ReservationPublic(**r.model_dump())
                cell["booked"] = True  # There is a reservation
                cell["players"] = reservation_players_map.get(
                    r.id, []
                )  # List of user_ids
            else:
                cell["reservation"] = None
                cell["booked"] = False  # No reservation
                cell["players"] = []  # No players

            schedule_cells["bookings"][booking_id] = cell

    return schedule_cells


@router.get("/users")
async def get_users_route(session: SessionDep) -> list[UserPublic]:
    users = get_users(session)
    return [UserPublic(**user.model_dump()) for user in users]


@router.post("/update-user-info", response_model=UserPublic)
async def update_user_info(
    user_id: int, user: UserUpdate, session: SessionDep
) -> UserPublic:
    updated_data = user.model_dump(exclude_unset=True)
    if "password" in updated_data:
        updated_data["hashed_password"] = AuthHandler().generate_password_hash(
            updated_data.pop("password")
        )
    updated_user = update_user(session, user_id, updated_data)
    return updated_user


@router.get("/delete-user", response_model=UserPublic)
async def delete_user_route(user_id: int, session: SessionDep) -> UserPublic:
    deleted_user = delete_user(session, user_id)
    return deleted_user


@router.post("/create-reservation", response_model=ReservationPublic)
async def create_reservation_api(
    reservation: ReservationCreate,
    reservationUsers: Annotated[list, Body()],
    session: SessionDep,
) -> ReservationPublic:
    print(reservation, reservationUsers, "&&&3")
    new_reservation = add_reservation(session, reservation)

    new_reservation_usrs = add_reservation_users(
        session, new_reservation.id, reservationUsers
    )
    return new_reservation


@router.get("/reservations")
async def reservations_api(session: SessionDep) -> list[ReservationPublic]:
    return get_reservations(session)


# @router.get("/get-courts-timeslots")
# async def get_courts_timeslots(session: SessionDep) -> dict[str, list]:
#     all_courts = get_courts(session)
#     all_timeslots = get_time_slots(session)
#     return {
#         "courts": all_courts,
#         "time_slots": all_timeslots,
#     }


# @router.get("/courts")
# async def get_all_courts_route(session: SessionDep) -> list[Court]:
#     return get_courts(session)


# @router.get("/time-slots")
# async def get_all_time_slots_route(session: SessionDep) -> list[TimeSlot]:
#     return get_time_slots(session)


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
