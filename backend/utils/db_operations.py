from fastapi import HTTPException
from sqlmodel import select, Session
from models.db_models import (
    Court,
    Reservation,
    ReservationUser,
    TimeSlot,
    User,
    ReservationCreate,
    ReservationUserCreate,
    ReservationUserPublic,
)


def get_users(session: Session) -> list[User]:
    return session.exec(select(User)).all()


def add_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_by_email(session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def update_user(session: Session, user_id: int, updated_data: dict) -> User:
    user_db = get_user_by_id(session, user_id)
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in updated_data.items():
        setattr(user_db, key, value)

    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    return user_db


def delete_user(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    print(user, user_id, "%^&")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return user


def get_courts(session: Session) -> list[Court]:
    return session.exec(select(Court)).all()


def get_time_slots(session: Session) -> list[TimeSlot]:
    return session.exec(select(TimeSlot)).all()


def get_reservations(session: Session) -> list[Reservation]:
    return session.exec(select(Reservation)).all()


def get_reservation_players(session: Session) -> list[ReservationUser]:
    return session.exec(select(ReservationUser)).all()


def get_court_by_id(session: Session, court_id: int) -> Court | None:
    return session.get(Court, court_id)


def get_time_slot_by_id(session: Session, time_slot_id: int) -> TimeSlot | None:
    return session.get(TimeSlot, time_slot_id)


def get_reservation_by_id(session: Session, reservation_id: int) -> Reservation | None:
    return session.get(Reservation, reservation_id)


def get_reservation_player_by_id(
    session: Session, reservation_player_id: int
) -> ReservationUser | None:
    return session.get(ReservationUser, reservation_player_id)


def add_reservation(session: Session, reservation: ReservationCreate) -> Reservation:
    reservation_db = Reservation.model_validate(reservation)
    print(reservation_db, "&&&55")
    session.add(reservation_db)
    session.commit()
    session.refresh(reservation_db)
    return reservation_db


# @app.post("/heroes/", response_model=HeroPublic)
# def create_hero(hero: HeroCreate, session: SessionDep):
#     db_hero = Hero.model_validate(hero)
#     session.add(db_hero)
#     session.commit()
#     session.refresh(db_hero)
#     return db_hero


def add_reservation_users(
    session: Session, reservation_id: int, reservation_user_ids: list[int]
) -> list[ReservationUserCreate]:
    reservation_users = [
        ReservationUser(reservation_id=reservation_id, user_id=u_id)
        for u_id in reservation_user_ids
    ]
    print(reservation_users, "&&&")
    session.add_all(reservation_users)
    session.commit()

    for ru in reservation_users:
        session.refresh(ru)

    print([ru.model_dump() for ru in reservation_users], "^&^^^^")

    return [ReservationUserPublic(**ru.model_dump()) for ru in reservation_users]


def delete_reservation(session: Session, reservation: Reservation) -> Reservation:
    session.delete(reservation)
    session.commit()
    return reservation


def update_reservation(
    session: Session, reservation: Reservation, update_field: str
) -> Reservation:
    existing_reservation = session.get(Reservation, reservation.id)
    if not existing_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    setattr(existing_reservation, update_field, getattr(reservation, update_field))
    session.commit()
    session.refresh(existing_reservation)
    return existing_reservation


def update_court(session: Session, court: Court, update_field: str) -> Court:
    existing_court = session.get(Court, court.id)
    if not existing_court:
        raise HTTPException(status_code=404, detail="Court not found")
    setattr(existing_court, update_field, getattr(court, update_field))
    session.commit()
    session.refresh(existing_court)
    return existing_court


def update_time_slot(
    session: Session, time_slot: TimeSlot, update_field: str
) -> TimeSlot:
    existing_time_slot = session.get(TimeSlot, time_slot.id)
    if not existing_time_slot:
        raise HTTPException(status_code=404, detail="TimeSlot not found")
    setattr(existing_time_slot, update_field, getattr(time_slot, update_field))
    session.commit()
    session.refresh(existing_time_slot)
    return existing_time_slot


def get_user_reservations(session: Session, user_id: int) -> list[Reservation]:
    reservations = session.exec(
        select(Reservation).where(Reservation.user_id == user_id)
    ).all()
    if not reservations:
        raise HTTPException(
            status_code=404, detail="No reservations found for this user"
        )
    return reservations
