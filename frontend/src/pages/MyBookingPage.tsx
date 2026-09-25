import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

interface Booking {
    id: number;
    room_id: number;
    firstname: string;
    lastname: string;
    checkin: string;
    checkout: string;
}

function MyBookingPage() {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitting, setSubmitting] = useState(false);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleLookup = async () => {
        setSubmitting(true);
        setStatus('idle');

        try {
            const res = await axios.get(`${API_BASE_URL}/api/bookings/lookup`, {
                params: { email }
            });
            setBookings(res.data);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (bookingId: number) => {
        const previousBookings = bookings;

        setBookings(bookings.filter(b => b.id !== bookingId));
        setCancellingId(bookingId);

        try {
            await axios.post(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, { email });
            setBookings(bookings.filter(b => b.id !== bookingId));
        } catch (err) {
            setBookings(previousBookings);
            alert('Failed to cancel booking. Please try again.');
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>My Bookings</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Enter the email you booked with to see your bookings.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input 
                    data-testid="lookup-email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    data-testid="lookup-submit"
                    onClick={handleLookup}
                    disabled={submitting || !email}
                    style={{ padding: '0.75rem 1.5rem',  backgroundColor: '#2c3e50', color: 'white', borderRadius: '4px', }}>
                        {submitting ? 'Searching...' : 'Find Bookings'}
                </button>
            </div>

            {status === 'error' && (
                <p data-testid='lookup-error' style={{ color: 'red' }}>
                    Something went wrong, Please try again.
                </p>
            )}
                {status === 'success' && bookings.length === 0 && (
                    <p data-testid='lookup-no-bookings' style={{ color: '#666' }}>
                        No bookings found for this email.
                    </p>
                )}
            
            {bookings.map(booking => (
                <div key={booking.id} data-testid="booking-result" style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    margin: '1rem 0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                    <p><strong>Booking #{booking.id}</strong></p>
                    <p>{booking.firstname} {booking.lastname}</p>
                    <p>{booking.checkin} to {booking.checkout}</p>
                    <button data-testid="lookup-cancel-button"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        style={{
                            padding: '0.5rem 1rem',
                            marginTop: '0.5rem'}}>
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel this booking'}
                    </button>
                </div>
            )
            )}
        </main>
    )}

export default MyBookingPage;