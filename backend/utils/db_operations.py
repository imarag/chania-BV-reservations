from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlmodel import Session, select, delete, and_
from datetime import date
from models.auth_models import UserSession
from models.db_models import (
    Court,
    Reservation,
    ReservationCreate,
    ReservationUser,
    ReservationUserPublic,
    TimeSlot,
    User,
    UserCreate,
    UserUpdate,
)
from utils.errors import AppError, raise_app_error


def get_users(session: Session) -> list[User]:
    return list(session.exec(select(User)).all())


def add_user(session: Session, user: UserCreate, generate_password_hash) -> User:
    user_db = User.model_validate(user)
    user_db_dict = user_db.model_dump()
    if "password" in user_db_dict:
        user_db_dict["hashed_passowrd"] = (
            generate_password_hash(user_db_dict["password"]),
        )
        del user_db_dict["password"]
    user_db = User(**user_db_dict)
    try:
        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db
    except IntegrityError as e:
        session.rollback()
        raise_app_error(AppError.EMAIL_ALREADY_REGISTERED, detail=str(e))
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def get_user_by_email(session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.exec(select(User).where(User.id == user_id)).first()


def update_user(
    session: Session, user_id: int, updated_user: UserUpdate, generate_password_hash
) -> User:
    user_db = session.get(User, user_id)
    if not user_db:
        raise_app_error(AppError.NOT_FOUND)

    updated_user_dict = updated_user.model_dump()

    if "password" in updated_user_dict:
        updated_user_dict["hashed_passowrd"] = (
            generate_password_hash(updated_user_dict["password"]),
        )
        del updated_user_dict["password"]

    user_db = User(**updated_user_dict)

    for key, value in updated_user.model_dump().items():
        if hasattr(user_db, key):
            setattr(user_db, key, value)

    try:
        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db
    except IntegrityError as e:
        session.rollback()
        raise_app_error(AppError.CONFLICT, detail=str(e))
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def get_courts(session: Session) -> list[Court]:
    return list(session.exec(select(Court)).all())


def get_time_slots(session: Session) -> list[TimeSlot]:
    return list(session.exec(select(TimeSlot)).all())


def get_court_by_id(session: Session, court_id: int) -> Court | None:
    return session.get(Court, court_id)


def get_time_slot_by_id(session: Session, time_slot_id: int) -> TimeSlot | None:
    return session.get(TimeSlot, time_slot_id)


def get_reservations(session: Session) -> list[Reservation]:
    return list(session.exec(select(Reservation)).all())


def get_reservations_by_date(
    session: Session, reservation_date: date
) -> list[Reservation]:
    reservations = session.exec(
        select(Reservation).where(Reservation.reservation_date == reservation_date)
    ).all()
    return list(reservations)


def get_reservation_by_id(session: Session, reservation_id: int) -> Reservation | None:
    return session.get(Reservation, reservation_id)


def add_reservation(session: Session, reservation: ReservationCreate) -> Reservation:
    reservation_db = Reservation.model_validate(reservation)
    try:
        session.add(reservation_db)
        session.commit()
        session.refresh(reservation_db)
        return reservation_db
    except IntegrityError as e:
        session.rollback()
        raise_app_error(AppError.CONFLICT, detail=str(e))
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def delete_reservation(session: Session, reservation_id: int):
    try:
        reservation = session.get(Reservation, reservation_id)
        if not reservation:
            raise_app_error(AppError.NOT_FOUND)
        session.delete(reservation)
        session.commit()
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def get_reservation_players(session: Session) -> list[ReservationUser]:
    return list(session.exec(select(ReservationUser)).all())


def add_reservation_users(
    session: Session, reservation_id: int, reservation_user_ids: list[int]
) -> list[ReservationUserPublic]:
    reservation_users = [
        ReservationUser(reservation_id=reservation_id, user_id=uid)
        for uid in reservation_user_ids
    ]
    try:
        session.add_all(reservation_users)
        session.commit()
        for r in reservation_users:
            session.refresh(r)
        return [ReservationUserPublic(**r.model_dump()) for r in reservation_users]
    except IntegrityError as e:
        session.rollback()
        raise_app_error(AppError.CONFLICT, detail=str(e))
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def delete_reservation_users(session: Session, reservation_id: int):
    try:
        session.exec(
            delete(ReservationUser).where(
                ReservationUser.reservation_id == reservation_id
            )
        )
        session.commit()
    except SQLAlchemyError:
        session.rollback()
        raise_app_error(AppError.SERVER_ERROR)


def get_reservation_by_user_id_by_date(
    session: Session, user_id: int, reservation_date: date
) -> Reservation | None:
    return session.exec(
        select(Reservation).where(
            and_(
                Reservation.user_id == user_id,
                Reservation.reservation_date == reservation_date,
            )
        )
    ).first()


def create_session(session: Session, user_session: UserSession) -> UserSession:
    user_session_db = UserSession.model_validate(user_session)

    try:
        session.add(user_session_db)
        session.commit()
        session.refresh(user_session_db)
        return user_session_db
    except IntegrityError as e:
        session.rollback()
        raise_app_error(AppError.CONFLICT, detail=str(e))
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


def get_user_session_by_id(
    session: Session, user_session_id: str
) -> UserSession | None:
    return session.get(UserSession, user_session_id)
