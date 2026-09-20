import { useState } from 'react';
import  axios  from 'axios';
import API_BASE_URL from '../config';

function CancelBookingPage() {
    const [bookingId, setBookingId] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [submitting, setSubmitting] = useState(false);

    const handleCancel = async () => {
        setSubmitting(true)
        setStatus('idle');

        try {
            await axios.post(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, { email });
            setStatus('success');
        } catch (error) {
            setStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
                <h1>Booking Cancelled</h1>
                <p>Your booking has been successfully cancelled.</p>
            </main>
        );
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Cancel Booking</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Enter your booking ID and email to cancel your booking.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    data-testid="cancel-booking-id"
                    placeholder="Booking ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <input
                    data-testid="cancel-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                {status === 'error' && (
                    <p data-testid="cancel-error" style={{ color: 'red' }}>
                        Booking not found. Double-check your booking ID and email.
                    </p>
                )}

                <button
                    data-testid="cancel-submit"
                    onClick={handleCancel}
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
                    {submitting ? 'Cancelling...' : 'Cancel Booking'}
                </button>
            </div>
        </main>
    )
}

export default CancelBookingPage;