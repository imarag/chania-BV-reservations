from typing import Union

from fastapi import HTTPException
from sqlmodel import Session, select

from models.db import Court, Reservation, TimeSlot, User


def get_users(session: Session) -> list[User]:
    return list(session.exec(select(User)))


def get_courts(session: Session) -> list[Court]:
    return list(session.exec(select(Court)))


def get_time_slots(session: Session) -> list[TimeSlot]:
    return list(session.exec(select(TimeSlot)))


def get_reservations(session: Session) -> list[Reservation]:
    return list(session.exec(select(Reservation)))


def get_user_by_email(session: Session, email: str) -> Union[User, None]:
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_id(session: Session, user_id: str) -> Union[User, None]:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_court_by_id(session: Session, court_id: str) -> Union[Court, None]:
    court = session.get(Court, court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    return court


def get_time_slot_by_id(session: Session, time_slot_id: str) -> Union[TimeSlot, None]:
    time_slot = session.get(TimeSlot, time_slot_id)
    if not time_slot:
        raise HTTPException(status_code=404, detail="TimeSlot not found")
    return time_slot


def get_reservation_by_id(
    session: Session, reservation_id: str
) -> Union[Reservation, None]:
    reservation = session.get(Reservation, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


def add_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def add_reservation(session: Session, reservation: Reservation) -> Reservation:
    session.add(reservation)
    session.commit()
    session.refresh(reservation)
    return reservation


def delete_reservation(session: Session, reservation: Reservation) -> Reservation:
    session.delete(reservation)
    session.commit()
    return reservation


def update_reservation(
    session: Session, reservation: Reservation, update_field: str
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


def update_court(session: Session, court: Court, update_field: str) -> Court:
    existing_court = session.exec(select(Court).where(Court.id == court.id)).first()
    if not existing_court:
        raise HTTPException(status_code=404, detail="Court not found")
    setattr(existing_court, update_field, getattr(court, update_field))
    session.commit()
    session.refresh(existing_court)
    return existing_court


def update_time_slot(
    session: Session, time_slot: TimeSlot, update_field: str
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


def get_user_reservations(session: Session, user_id: str) -> list[Reservation]:
    reservations = list(
        session.exec(select(Reservation).where(Reservation.user_id == user_id))
    )
    if not reservations:
        raise HTTPException(
            status_code=404, detail="No reservations found for this user"
        )
    return reservations
