-- create tables

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    CONSTRAINT checkout_after_checkin CHECK (checkout > checkin)
);

-- Create indexes

CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);

CREATE INDEX IF NOT EXISTS idx_bookings_checkin ON bookings(checkin);

-- Seed rooms data

INSERT INTO rooms (name, price, description, image) VALUES
('Standard Single Room', 85, 'A cosy single room with basic amenities and free WiFi.', 'https://placehold.co/400x200'),
('Deluxe Double Room', 120, 'Spacious double room with a king size bed and city view.', 'https://placehold.co/400x200'),
('Executive Suite', 200, 'Luxury suite with separate living area and premium furnishings.', 'https://placehold.co/400x200');