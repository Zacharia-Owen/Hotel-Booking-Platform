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

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1rem',
      margin: '1rem 0',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <div className="skeleton-bar" style={{ height: '1.5rem', width: '60%', marginBottom: '0.75rem' }}/>
      <div className="skeleton-bar" style={{ height: '1.5rem', width: '90%', marginBottom: '0.5rem'}}/>
      <div className="skeleton-bar" style={{ height: '1.5rem', width: '30%', marginBottom: '0.75rem'}}/>
      <div className="skeleton-bar" style={{ height: '2.5rem', width: '140px' }}/>
    </div>
  )
}

function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRooms = () => {
    setLoading(true);
    setError('');

    axios.get(`${API_BASE_URL}/api/rooms`)
      .then(res => {
        setRooms(res.data.rooms);
        setLoading(false);
      })
      .catch(_err => {
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: '2rem' }}>
        <style>{`
          .skeleton-bar {
            background: linear-gradiemt(90deg, #eee 25%, #ddd 50%, #eee 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 4px;
          }
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          `}</style>
          <h1>Available Rooms</h1>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button
          data-testid="retry-button"
          onClick={fetchRooms}
          style={{ padding: '0.75rem 1.5rem', marginTop: '1rem'  }}>
          Try Again
        </button>
      </main>

    )
  }


  return (
    <main style={{ padding: '2rem' }}>
      <h1>Available Rooms ({rooms.length})</h1>
      {rooms.length === 0 && <p>No rooms found</p>}
      {rooms.map(room => (
        <div key={room.id} data-testid="room-card" style={{
          backgroundColor: 'white',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>{room.name}</h2>
          <p>{room.description}</p>
          <p>${room.price}/night</p>
          <button
            data-testid="book-button"
            onClick={() => navigate(`/booking/${room.id}`)}>
            Book this room
          </button>
        </div>
      ))}
    </main>
  );
}

export default HomePage;