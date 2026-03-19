import { useEffect, useState } from 'react';
import { getAllBookings, cancelBooking } from '../api';
import toast from 'react-hot-toast';
import { FaCalendarCheck, FaBan, FaHotel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = { BOOKED: '#22c55e', CANCELLED: '#ef4444' };

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    try {
      const res = await getAllBookings();
      // filter by current user unless ADMIN
      const data = user?.role === 'ADMIN'
        ? res.data
        : res.data.filter(b => b.userId === user.userId);
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  }

  function formatDate(dt) {
    return new Date(dt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function nights(checkIn, checkOut) {
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1><FaCalendarCheck /> My Bookings</h1>
        <button className="btn-primary" onClick={() => navigate('/hotels')}>+ New Booking</button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <span>🗓️</span>
          <p>No bookings yet.</p>
          <button className="btn-primary" onClick={() => navigate('/hotels')}>Browse Hotels</button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <div className="booking-accent" style={{ background: STATUS_COLORS[b.status] }} />
              <div className="booking-icon"><FaHotel /></div>
              <div className="booking-info">
                <div className="booking-top">
                  <h3>Hotel #{b.hotelId}</h3>
                  <span className="booking-status" style={{ color: STATUS_COLORS[b.status] }}>
                    ● {b.status}
                  </span>
                </div>
                <div className="booking-dates">
                  <div><label>Check-In</label><span>{formatDate(b.checkIn)}</span></div>
                  <div className="date-arrow">→</div>
                  <div><label>Check-Out</label><span>{formatDate(b.checkOut)}</span></div>
                </div>
                <div className="booking-meta">
                  <span>🌙 {nights(b.checkIn, b.checkOut)} night(s)</span>
                  <span>💰 ₹{b.price?.toLocaleString()}</span>
                  {user?.role === 'ADMIN' && <span>👤 User #{b.userId}</span>}
                </div>
              </div>
              {b.status !== 'CANCELLED' && (
                <button className="btn-cancel" onClick={() => handleCancel(b.id)}>
                  <FaBan /> Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
