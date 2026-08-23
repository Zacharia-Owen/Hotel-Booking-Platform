import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

interface Room {
  id: number;
  name: string;
  price: number;
}

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  checkin?: string;
  checkout?: string;
}

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/rooms`)
      .then(res => {
        const found = res.data.rooms.find((r: Room) => r.id === Number(roomId));
        setRoom(found);
      });
  }, [roomId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstname.trim())
      newErrors.firstname = 'First name is required';

    if (!formData.lastname.trim())
      newErrors.lastname = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain numbers only';
    }

    if (!formData.checkin) newErrors.checkin = 'Check-in date is required';
    if (!formData.checkout) newErrors.checkout = 'Check-out date is required';

    if (formData.checkin && formData.checkout && formData.checkin >= formData.checkout) {
     newErrors.checkout = 'Check-out date must be after check-in date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
        ...formData,
        roomID: Number(roomId)
      });
      navigate('/confirmation', { state: { booking: response.data } });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Something went wrong. Please try again.';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!room) return <p style={{ padding: '2rem' }}>Loading room details...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Book: {room.name}</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>${room.price}/night</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div>
          <input
            data-testid="firstname"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.firstname && (
            <p data-testid="firstname-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.firstname}
            </p>
          )}
        </div>

        <div>
          <input
            data-testid="lastname"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.lastname && (
            <p data-testid="lastname-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.lastname}
            </p>
          )}
        </div>

        <div>
          <input
            data-testid="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.email && (
            <p data-testid="email-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            data-testid="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.phone && (
            <p data-testid="phone-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Check-in Date</label>
          <input
            data-testid="checkin"
            name="checkin"
            type="date"
            value={formData.checkin}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.checkin && (
            <p data-testid="checkin-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.checkin}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', color: '#666' }}>Check-out Date</label>
          <input
            data-testid="checkout"
            name="checkout"
            type="date"
            value={formData.checkout}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {errors.checkout && (
            <p data-testid="checkout-error" style={{ color: 'red', marginTop: '0.25rem' }}>
              {errors.checkout}
            </p>
          )}
        </div>

        <button
          data-testid="submit-booking"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '1rem',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            opacity: submitting ? 0.7 : 1
          }}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>

      </div>
    </div>
  );
}

export default BookingPage;