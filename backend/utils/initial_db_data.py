from datetime import date, datetime, time

# --- Users ---
users = [
    {
        "id": 1,
        "full_name": "Alice Smith",
        "email": "alice@example.com",
        "password": "alice123",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 0),
        "phone_number": "1234567890",
        "role": "player",
        "address": None,
        "date_of_birth": date(1990, 1, 15),
        "profession": None,
    },
    {
        "id": 2,
        "full_name": "Bob Johnson",
        "email": "bob@example.com",
        "password": "bob456",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 5),
        "phone_number": "2345678901",
        "role": "player",
        "address": None,
        "date_of_birth": date(1988, 5, 20),
        "profession": None,
    },
    {
        "id": 3,
        "full_name": "Carol White",
        "email": "carol@example.com",
        "password": "carol789",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 10),
        "phone_number": "3456789012",
        "role": "admin",
        "address": None,
        "date_of_birth": date(1985, 3, 10),
        "profession": "Manager",
    },
    # ... similar for users 4–12
]

# --- Courts ---
courts = [
    {
        "id": 1,
        "name": "Court 1",
        "status": "available",
        "professional": False,
        "description": "Main court",
    },
    {
        "id": 2,
        "name": "Court 2",
        "status": "available",
        "professional": False,
        "description": "Side court",
    },
    {
        "id": 3,
        "name": "Court 3",
        "status": "maintenance",
        "professional": False,
        "description": "Under repair",
    },
    {
        "id": 4,
        "name": "Court 4",
        "status": "available",
        "professional": False,
        "description": "Outdoor court",
    },
    {
        "id": 5,
        "name": "Court 5",
        "status": "available",
        "professional": False,
        "description": "Indoor court",
    },
]

# --- Timeslots ---
timeslots = [
    {
        "id": 1,
        "start_time": time(16, 30),
        "end_time": time(18, 0),
        "status": "available",
        "description": None,
    },
    {
        "id": 2,
        "start_time": time(18, 0),
        "end_time": time(19, 30),
        "status": "available",
        "description": None,
    },
    {
        "id": 3,
        "start_time": time(19, 30),
        "end_time": time(21, 0),
        "status": "available",
        "description": None,
    },
    {
        "id": 4,
        "start_time": time(21, 0),
        "end_time": time(22, 30),
        "status": "available",
        "description": None,
    },
]

# --- Reservations ---
reservations = [
    {
        "id": 1,
        "user_id": 1,
        "court_id": 1,
        "timeslot_id": 1,
        "reservation_date": date(2025, 8, 18),
        "status": "confirmed",
    },
    {
        "id": 2,
        "user_id": 2,
        "court_id": 2,
        "timeslot_id": 2,
        "reservation_date": date(2025, 8, 18),
        "status": "confirmed",
    },
    {
        "id": 3,
        "user_id": 3,
        "court_id": 4,
        "timeslot_id": 3,
        "reservation_date": date(2025, 8, 18),
        "status": "confirmed",
    },
]

# --- Reservation Players ---
reservation_players = [
    {"reservation_id": 1, "user_id": 1},
    {"reservation_id": 1, "user_id": 2},
    {"reservation_id": 1, "user_id": 3},
    {"reservation_id": 1, "user_id": 4},
    {"reservation_id": 2, "user_id": 2},
    {"reservation_id": 2, "user_id": 5},
    {"reservation_id": 2, "user_id": 6},
    {"reservation_id": 2, "user_id": 7},
    {"reservation_id": 3, "user_id": 3},
    {"reservation_id": 3, "user_id": 8},
    {"reservation_id": 3, "user_id": 9},
    {"reservation_id": 3, "user_id": 10},
]
