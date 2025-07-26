CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    building TEXT NOT NULL,
    floor INT NOT NULL,
    room_number TEXT,
    year INT CHECK (year >= 1 AND year <= 6),
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
