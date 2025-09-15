from typing import Sequence, List

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlmodel import Session, select

from models.auth_models import UserSession
from models.db_models import (
    Court,
    Reservation,
    ReservationCreate,
    ReservationUser,
    ReservationUserPublic,
    TimeSlot,
    User,
)
from utils.errors import AppError, raise_app_error


# ---------- Sessions ----------

def get_user_session_by_id(session: Session, user_session_id: str) -> UserSession | None:
    return session.get(UserSession, user_session_id)


def create_session(session: Session, user_session: UserSession) -> UserSession:
    try:
        session.add(user_session)
        session.commit()
        session.refresh(user_session)
        return user_session
    except IntegrityError:
        session.rollback()
        raise_app_error(AppError.CONFLICT)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def delete_session(session: Session, user_session_id: str) -> UserSession | None:
    if not user_session_id:
        return None
    us = session.get(UserSession, user_session_id)
    if not us:
        return None
    try:
        session.delete(us)
        session.commit()
        return us
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


# ---------- Users ----------

def get_users(session: Session) -> Sequence[User]:
    return session.exec(select(User)).all()


def add_user(session: Session, user: User) -> User:
    try:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    except IntegrityError:
        session.rollback()
        # e.g., unique(email) violation
        raise_app_error(AppError.EMAIL_ALREADY_REGISTERED)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def get_user_by_email(session: Session, email: str) -> User | None:
    normalized = email.strip().lower()
    return session.exec(select(User).where(User.email == normalized)).first()


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def update_user(session: Session, user_id: int, updated_data: dict) -> User:
    user_db = get_user_by_id(session, user_id)
    if not user_db:
        raise_app_error(AppError.NOT_FOUND)

    # Optionally whitelist fields; here we set whatever keys exist on the model
    for key, value in updated_data.items():
        if hasattr(user_db, key):
            setattr(user_db, key, value)

    try:
        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db
    except IntegrityError:
        session.rollback()
        raise_app_error(AppError.CONFLICT)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def delete_user(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise_app_error(AppError.NOT_FOUND)
    try:
        session.delete(user)
        session.commit()
        return user
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


# ---------- Courts & Time Slots ----------

def get_courts(session: Session) -> Sequence[Court]:
    return session.exec(select(Court)).all()


def get_time_slots(session: Session) -> Sequence[TimeSlot]:
    return session.exec(select(TimeSlot)).all()


def get_court_by_id(session: Session, court_id: int) -> Court | None:
    return session.get(Court, court_id)


def get_time_slot_by_id(session: Session, time_slot_id: int) -> TimeSlot | None:
    return session.get(TimeSlot, time_slot_id)


def update_court(session: Session, court: Court, update_field: str) -> Court:
    existing = session.get(Court, court.id)
    if not existing:
        raise_app_error(AppError.NOT_FOUND)
    setattr(existing, update_field, getattr(court, update_field))
    try:
        session.commit()
        session.refresh(existing)
        return existing
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def update_time_slot(session: Session, time_slot: TimeSlot, update_field: str) -> TimeSlot:
    existing = session.get(TimeSlot, time_slot.id)
    if not existing:
        raise_app_error(AppError.NOT_FOUND)
    setattr(existing, update_field, getattr(time_slot, update_field))
    try:
        session.commit()
        session.refresh(existing)
        return existing
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


# ---------- Reservations ----------

def get_reservations(session: Session) -> Sequence[Reservation]:
    return session.exec(select(Reservation)).all()


def get_reservation_players(session: Session) -> Sequence[ReservationUser]:
    return session.exec(select(ReservationUser)).all()


def get_reservation_by_id(session: Session, reservation_id: int) -> Reservation | None:
    return session.get(Reservation, reservation_id)


def get_reservation_player_by_id(session: Session, reservation_player_id: int) -> ReservationUser | None:
    return session.get(ReservationUser, reservation_player_id)


def get_reservation_by_user_id(session: Session, user_id: int) -> Reservation | None:
    return session.exec(select(Reservation).where(Reservation.user_id == user_id)).first()


def get_user_reservations(session: Session, user_id: int) -> Sequence[Reservation]:
    # Return an empty list if none; let the route decide how to present it.
    return session.exec(select(Reservation).where(Reservation.user_id == user_id)).all()


def add_reservation(session: Session, reservation: ReservationCreate) -> Reservation:
    reservation_db = Reservation.model_validate(reservation)
    try:
        session.add(reservation_db)
        session.commit()
        session.refresh(reservation_db)
        return reservation_db
    except IntegrityError:
        session.rollback()
        raise_app_error(AppError.CONFLICT)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def add_reservation_users(session: Session, reservation_id: int, reservation_user_ids: List[int]) -> list[ReservationUserPublic]:
    # Deduplicate to avoid accidental duplicates
    rows = [ReservationUser(reservation_id=reservation_id, user_id=uid) for uid in dict.fromkeys(reservation_user_ids)]
    try:
        session.add_all(rows)
        session.commit()
        for r in rows:
            session.refresh(r)
        return [ReservationUserPublic(**r.model_dump()) for r in rows]
    except IntegrityError:
        session.rollback()
        raise_app_error(AppError.CONFLICT)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def delete_reservation(session: Session, reservation: Reservation) -> Reservation:
    try:
        session.delete(reservation)
        session.commit()
        return reservation
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def update_reservation(session: Session, reservation: Reservation, update_field: str) -> Reservation:
    existing = session.get(Reservation, reservation.id)
    if not existing:
        raise_app_error(AppError.NOT_FOUND)
    setattr(existing, update_field, getattr(reservation, update_field))
    try:
        session.commit()
        session.refresh(existing)
        return existing
    except IntegrityError:
        session.rollback()
        raise_app_error(AppError.CONFLICT)
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)
