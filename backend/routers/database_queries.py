from typing import Annotated

from dependencies import AuthHandlerDep, CurrentUserDep, SettingsDep
from dependencies import SessionDep
from utils.util_functions import get_reservation_cutoff_utc_date
from fastapi import APIRouter, Body
from models.db_models import (
    CourtPublic,
    ReservationCreate,
    ReservationPublic,
    TimeSlotPublic,
    UserPublic,
    UserUpdate,
)
from utils.db_operations import (
    add_reservation,
    add_reservation_users,
    get_courts,
    get_reservation_players,
    get_reservations,
    get_time_slots,
    get_users,
    update_user,
    get_reservation_by_id,
    delete_reservation,
    delete_reservation_users,
    get_reservations_by_date,
)
from utils.errors import AppError, raise_app_error

router = APIRouter()


@router.get("/users")
async def get_users_api(session: SessionDep) -> list[UserPublic]:
    users = get_users(session)
    return [UserPublic(**u.model_dump()) for u in users]


@router.get("/courts")
async def get_courts_api(session: SessionDep) -> list[CourtPublic]:
    all_courts = get_courts(session)
    return [CourtPublic(**c.model_dump()) for c in all_courts]


@router.get("/timeslots")
async def get_time_slots_api(session: SessionDep) -> list[TimeSlotPublic]:
    all_time_slots = get_time_slots(session)
    return [TimeSlotPublic(**ts.model_dump()) for ts in all_time_slots]


@router.get("/current-reservations")
async def get_current_reservations_api(session: SessionDep) -> list[ReservationPublic]:
    current_reservations = get_reservations_by_date(
        session, get_reservation_cutoff_utc_date()
    )
    return [ReservationPublic(**r.model_dump()) for r in current_reservations]


@router.get("/get-booking-cells")
async def get_booking_cells(session: SessionDep, settings: SettingsDep) -> dict:

    # Fetch all courts, timeslots, reservations, and reservation_players
    all_users = get_users(session)
    reservation_players = get_reservation_players(session)

    # Dictionary mapping: user_id -> user details
    user_map = {u.id: u for u in all_users}

    # Dictionary mapping: reservation_id -> list of user_ids
    reservation_players_map = {}
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

    current_reservations = get_reservations_by_date(
        session, get_reservation_cutoff_utc_date()
    )

    # Dictionary mapping: (court_id, timeslot_id) -> reservation
    reservation_map = {f"{r.court_id}-{r.timeslot_id}": r for r in current_reservations}

    # Build flattened schedule cells
    schedule_cells = {}

    for r_key in reservation_map.keys():
        cell = {}

        # Check if this (court_id, timeslot_id) is booked
        r = reservation_map.get(r_key)
        if r is not None:
            cell["booking_user"] = user_map[
                r.user_id
            ]  # The user who made the reservation
            cell["reservation"] = ReservationPublic(**r.model_dump())
            cell["booked"] = True  # There is a reservation
            cell["players"] = reservation_players_map.get(r.id, [])  # List of user_ids
        else:
            cell["reservation"] = None
            cell["booked"] = False  # No reservation
            cell["players"] = []  # No players

        schedule_cells[r_key] = cell

    return schedule_cells


@router.get("/available-users")
async def get_available_users(session: SessionDep) -> list[UserPublic]:
    users = get_users(session)

    active_users = [user for user in users if user.active]
    active_user_ids = {user.id for user in active_users}

    reservation_users = get_reservation_players(session)
    reservation_user_ids = {ru.user_id for ru in reservation_users}

    available_user_ids = active_user_ids - reservation_user_ids

    return [
        UserPublic(**user.model_dump())
        for user in active_users
        if user.id in available_user_ids
    ]


@router.post("/update-user-info", response_model=UserPublic)
async def update_user_info(
    user_id: int,
    user: UserUpdate,
    session: SessionDep,
    current_user: CurrentUserDep,
    auth_handler: AuthHandlerDep,
) -> UserPublic:

    if current_user.id != user_id:
        raise_app_error(AppError.NOT_AUTHORIZED)

    updated_data_dict = user.model_dump(exclude_unset=True)

    user_update = UserUpdate(**updated_data_dict)

    updated_user = update_user(
        session, user_id, user_update, auth_handler.generate_password_hash
    )
    return UserPublic(**updated_user.model_dump())


@router.get("/reservations")
async def reservations_api(session: SessionDep) -> list[ReservationPublic]:
    reservations = get_reservations(session)
    return [ReservationPublic(**res.model_dump()) for res in reservations]


@router.post("/create-reservation", response_model=ReservationPublic)
async def create_reservation_api(
    reservation: ReservationCreate,
    reservation_users: Annotated[list[int], Body()],
    session: SessionDep,
    settings: SettingsDep,
    current_user: CurrentUserDep,
) -> ReservationPublic:
    # frontend sends 3 users, i add the current user in the backend
    reservation_users += [current_user.id]
    if len(set(reservation_users)) != settings.TOTAL_PLAYERS_PER_RESERVATION:
        raise_app_error(
            AppError.RESERVATION_NOT_ALLOWED, detail="Not enough players selected"
        )
    new_reservation = add_reservation(session, reservation).model_copy()
    add_reservation_users(session, new_reservation.id, reservation_users)
    return ReservationPublic(**new_reservation.model_dump())


@router.post("/delete-reservation", response_model=ReservationPublic)
async def delete_reservation_api(
    reservation_id: int, session: SessionDep, current_user: CurrentUserDep
) -> ReservationPublic:
    reservation = get_reservation_by_id(session, reservation_id)

    if reservation is None:
        raise_app_error(AppError.NOT_FOUND, detail="Reservation not found")

    # check if the current user is the same as the one did the reservation
    # only the user that did the reservation can delete it
    if current_user.id != reservation.user_id:
        raise_app_error(AppError.NOT_AUTHORIZED)

    delete_reservation(session, reservation_id)
    delete_reservation_users(session, reservation_id)

    return ReservationPublic(**reservation.model_dump())
