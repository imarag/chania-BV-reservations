from datetime import datetime, time

users = [
    {
        "id": "e1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "name": "Alice Smith",
        "email": "alice@example.com",
        "hashed_password": "alice123",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 0),
        "phone_number": "1234567890",
        "role": "player",
    },
    {
        "id": "f2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "name": "Bob Johnson",
        "email": "bob@example.com",
        "hashed_password": "bob456",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 5),
        "phone_number": "2345678901",
        "role": "player",
    },
    {
        "id": "a3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
        "name": "Carol White",
        "email": "carol@example.com",
        "hashed_password": "carol789",
        "active": True,
        "created_at": datetime(2025, 8, 17, 10, 10),
        "phone_number": "3456789012",
        "role": "admin",
    },
]

courts = [
    {
        "id": "c1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "name": "Court 1",
        "status": "available",
        "description": "Main court",
    },
    {
        "id": "c2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "name": "Court 2",
        "status": "available",
        "description": "Side court",
    },
    {
        "id": "c3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
        "name": "Court 3",
        "status": "maintenance",
        "description": "Under repair",
    },
    {
        "id": "c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
        "name": "Court 4",
        "status": "available",
        "description": "Outdoor court",
    },
    {
        "id": "c5e6f7a8-9b0c-1d2e-3f4a-5b6c7d8e9f0a",
        "name": "Court 5",
        "status": "available",
        "description": "Indoor court",
    },
]

timeslots = [
    {
        "id": "t1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "start_time": time(16, 30),
        "end_time": time(18, 0),
        "name": "16:30-18:00",
        "status": "available",
        "description": "",
    },
    {
        "id": "t2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "start_time": time(18, 0),
        "end_time": time(19, 30),
        "name": "18:00-19:30",
        "status": "available",
        "description": "",
    },
    {
        "id": "t3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
        "start_time": time(19, 30),
        "end_time": time(21, 0),
        "name": "19:30-21:00",
        "status": "available",
        "description": "",
    },
    {
        "id": "t4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
        "start_time": time(21, 0),
        "end_time": time(22, 30),
        "name": "21:00-22:30",
        "status": "available",
        "description": "",
    },
]

reservations = [
    {
        "user_id": "e1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "court_id": "c1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "timeslot_id": "t1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
        "reservation_date": datetime(2025, 8, 18, 16, 30),
        "status": "pending",
        "notes": "First reservation",
    },
    {
        "user_id": "f2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "court_id": "c2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "timeslot_id": "t2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
        "reservation_date": datetime(2025, 8, 18, 18, 0),
        "status": "confirmed",
        "notes": "",
    },
    {
        "user_id": "a3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
        "court_id": "c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
        "timeslot_id": "t3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e",
        "reservation_date": datetime(2025, 8, 18, 19, 30),
        "status": "pending",
        "notes": "Admin test reservation",
    },
]
