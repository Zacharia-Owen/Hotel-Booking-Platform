import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching rooms...');
    axios.get(`${API_BASE_URL}/api/rooms`)
      .then(res => {
        console.log('Rooms received:', res.data);
        setRooms(res.data.rooms);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error:', err.message);
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      });
  }, []);

  console.log('Current state - loading:', loading, 'rooms:', rooms, 'error:', error);

  if (loading) return <p style={{ padding: '2rem' }}>Loading rooms...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Available Rooms ({rooms.length})</h2>
      {rooms.length === 0 && <p>No rooms found</p>}
      {rooms.map(room => (
        <div key={room.id} data-testid="room-card" style={{
          backgroundColor: 'white',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>{room.name}</h3>
          <p>{room.description}</p>
          <p>${room.price}/night</p>
          <button
            data-testid="book-button"
            onClick={() => navigate(`/booking/${room.id}`)}>
            Book this room
          </button>
        </div>
      ))}
    </div>
  );
}

export default HomePage;