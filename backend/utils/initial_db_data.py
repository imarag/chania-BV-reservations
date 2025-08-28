from datetime import datetime, time

users = [
    {
        "username": "Alice Smith",
        "email": "alice@example.com",
        "password": "alice123",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 0),
        "phone_number": "1234567890",
        "role": "player",
    },
    {
        "username": "Bob Johnson",
        "email": "bob@example.com",
        "password": "bob456",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 5),
        "phone_number": "2345678901",
        "role": "player",
    },
    {
        "username": "Carol White",
        "email": "carol@example.com",
        "password": "carol789",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 10),
        "phone_number": "3456789012",
        "role": "admin",
    },
]

courts = [
    {"name": "Court 1", "status": "available", "description": "Main court"},
    {"name": "Court 2", "status": "available", "description": "Side court"},
    {"name": "Court 3", "status": "maintenance", "description": "Under repair"},
    {"name": "Court 4", "status": "available", "description": "Outdoor court"},
    {"name": "Court 5", "status": "available", "description": "Indoor court"},
]

timeslots = [
    {
        "start_time": time(16, 30),
        "end_time": time(18, 0),
        "name": "16:30-18:00",
        "status": "available",
        "description": "",
    },
    {
        "start_time": time(18, 0),
        "end_time": time(19, 30),
        "name": "18:00-19:30",
        "status": "available",
        "description": "",
    },
    {
        "start_time": time(19, 30),
        "end_time": time(21, 0),
        "name": "19:30-21:00",
        "status": "available",
        "description": "",
    },
    {
        "start_time": time(21, 0),
        "end_time": time(22, 30),
        "name": "21:00-22:30",
        "status": "available",
        "description": "",
    },
]

reservations = [
    {
        "user_id": 1,
        "court_id": 1,
        "timeslot_id": 1,
        "reservation_date": datetime(2025, 8, 18, 16, 30),
        "status": "pending",
        "notes": "First reservation",
    },
    {
        "user_id": 2,
        "court_id": 2,
        "timeslot_id": 2,
        "reservation_date": datetime(2025, 8, 18, 18, 0),
        "status": "confirmed",
        "notes": "",
    },
    {
        "user_id": 3,
        "court_id": 4,
        "timeslot_id": 3,
        "reservation_date": datetime(2025, 8, 18, 19, 30),
        "status": "pending",
        "notes": "Admin test reservation",
    },
]

reservation_players = [
    {"reservation_id": 1, "user_id": 1},
    {"reservation_id": 1, "user_id": 2},
    {"reservation_id": 2, "user_id": 2},
    {"reservation_id": 3, "user_id": 3},
]
