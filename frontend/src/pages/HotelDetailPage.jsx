import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotel, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaStar, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({ checkIn: '', checkOut: '' });

  useEffect(() => {
    getHotel(id)
      .then(r => setHotel(r.data))
      .catch(() => toast.error('Hotel not found'))
      .finally(() => setLoading(false));
  }, [id]);

  function renderStars(r) {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.round(r) ? 'star filled' : 'star'} />
    ));
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!form.checkIn || !form.checkOut) { toast.error('Please select dates'); return; }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    setBooking(true);
    try {
      await createBooking({
        hotelId: Number(id),
        checkIn: form.checkIn + ':00',
        checkOut: form.checkOut + ':00',
        price: hotel.price,
      });
      toast.success('🎉 Booking confirmed!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!hotel) return <div className="page"><p>Hotel not found.</p></div>;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/hotels')}>
        <FaArrowLeft /> Back to Hotels
      </button>

      <div className="detail-hero" style={{ background: `hsl(${(hotel.id * 47) % 360}, 60%, 20%)` }}>
        <div className="detail-hero-content">
          <span className="detail-city"><FaMapMarkerAlt /> {hotel.city}</span>
          <h1>{hotel.name}</h1>
          <div className="detail-stars">{renderStars(hotel.rating || 0)} <span>{hotel.rating?.toFixed(1)}</span></div>
        </div>
        <div className="detail-price">
          <span className="price-amount">₹{hotel.price?.toLocaleString()}</span>
          <span className="price-label">per night</span>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-info">
          <h2>About this hotel</h2>
          <p>{hotel.description || 'A wonderful place to stay with excellent amenities and top-notch service.'}</p>
          {hotel.address && <p><FaMapMarkerAlt /> <strong>Address:</strong> {hotel.address}</p>}
        </div>

        <div className="booking-panel">
          <h2><FaCalendarAlt /> Book Your Stay</h2>
          {!user ? (
            <div className="login-prompt">
              <p>Sign in to book this hotel</p>
              <button className="btn-primary btn-full" onClick={() => navigate('/login')}>Sign In to Book</button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="booking-form">
              <div className="form-group">
                <label>Check-In</label>
                <input type="datetime-local" value={form.checkIn}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={e => setForm({ ...form, checkIn: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Check-Out</label>
                <input type="datetime-local" value={form.checkOut}
                  min={form.checkIn || new Date().toISOString().slice(0, 16)}
                  onChange={e => setForm({ ...form, checkOut: e.target.value })} required />
              </div>
              <div className="price-summary">
                <span>Price per night</span>
                <strong>₹{hotel.price?.toLocaleString()}</strong>
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={booking}>
                {booking ? 'Booking…' : '✅ Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
