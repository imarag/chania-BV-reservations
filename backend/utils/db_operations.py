from fastapi import HTTPException
from sqlmodel import select
from dependencies import SessionDep
from models.db_models import Court, Reservation, ReservationUser, TimeSlot, User


def get_users(session: SessionDep) -> list[User]:
    return list(session.exec(select(User)).all())


def get_courts(session: SessionDep) -> list[Court]:
    return list(session.exec(select(Court)))


def get_time_slots(session: SessionDep) -> list[TimeSlot]:
    return list(session.exec(select(TimeSlot)))


def get_reservations(session: SessionDep) -> list[Reservation]:
    return list(session.exec(select(Reservation)))


def get_reservation_players(session: SessionDep) -> list[ReservationUser]:
    return list(session.exec(select(ReservationUser)))


def get_user_by_email(session: SessionDep, email: str) -> User | None:
    user = session.exec(select(User).where(User.email == email)).first()
    return User(**user.model_dump()) if user else None


def get_user_by_name(session: SessionDep, name: str) -> User | None:
    user = session.exec(select(User).where(User.name == name)).first()
    return User(**user.model_dump()) if user else None


def get_user_by_id(session: SessionDep, user_id: int) -> User | None:
    user = session.get(User, user_id)
    return User(**user.model_dump()) if user else None


def get_court_by_id(session: SessionDep, court_id: int) -> Court | None:
    court = session.get(Court, court_id)
    return court if court else None


def get_time_slot_by_id(session: SessionDep, time_slot_id: int) -> TimeSlot | None:
    time_slot = session.get(TimeSlot, time_slot_id)
    return time_slot if time_slot else None


def get_reservation_by_id(session: SessionDep, reservation_id: int) -> Reservation | None:
    reservation = session.get(Reservation, reservation_id)
    return reservation if reservation else None






def get_reservation_player_by_id(
    session: SessionDep, reservation_player_id: int
) -> ReservationUser | None:
    reservation_player = session.get(ReservationUser, reservation_player_id)
    return reservation_player if reservation_player else None


def add_user(session: SessionDep, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return User(**user.model_dump())


def add_reservation(session: SessionDep, reservation: Reservation) -> Reservation:
    session.add(reservation)
    session.commit()
    session.refresh(reservation)
    return reservation


def delete_reservation(session: SessionDep, reservation: Reservation) -> Reservation:
    session.delete(reservation)
    session.commit()
    return reservation


def update_reservation(
    session: SessionDep, reservation: Reservation, update_field: str
) -> Reservation:
    existing_reservation = session.exec(
        select(Reservation).where(Reservation.id == reservation.id)
    ).first()
    if not existing_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    setattr(existing_reservation, update_field, getattr(reservation, update_field))
    session.commit()
    session.refresh(existing_reservation)
    return existing_reservation


def update_court(session: SessionDep, court: Court, update_field: str) -> Court:
    existing_court = session.exec(select(Court).where(Court.id == court.id)).first()
    if not existing_court:
        raise HTTPException(status_code=404, detail="Court not found")
    setattr(existing_court, update_field, getattr(court, update_field))
    session.commit()
    session.refresh(existing_court)
    return existing_court


def update_time_slot(
    session: SessionDep, time_slot: TimeSlot, update_field: str
) -> TimeSlot:
    existing_time_slot = session.exec(
        select(TimeSlot).where(TimeSlot.id == time_slot.id)
    ).first()
    if not existing_time_slot:
        raise HTTPException(status_code=404, detail="TimeSlot not found")
    setattr(existing_time_slot, update_field, getattr(time_slot, update_field))
    session.commit()
    session.refresh(existing_time_slot)
    return existing_time_slot


def get_user_reservations(session: SessionDep, user_id: int) -> list[Reservation]:
    reservations = list(
        session.exec(select(Reservation).where(Reservation.user_id == user_id))
    )
    if not reservations:
        raise HTTPException(
            status_code=404, detail="No reservations found for this user"
        )
    return reservations
