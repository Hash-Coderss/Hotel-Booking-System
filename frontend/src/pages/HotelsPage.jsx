import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHotels } from '../api';
import { FaSearch, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AMENITY_ICONS = [<FaWifi />, <FaParking />, <FaSwimmingPool />];

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels(c = '') {
    setLoading(true);
    try {
      const res = await getAllHotels(c || undefined);
      setHotels(res.data);
    } catch {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchHotels(search);
    setCity(search);
  }

  function renderStars(rating) {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.round(rating) ? 'star filled' : 'star'} />
    ));
  }

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing hotels at the best prices</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <FaMapMarkerAlt className="search-icon" />
            <input
              type="text"
              placeholder="Search by city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              <FaSearch /> Search
            </button>
          </form>
          {city && (
            <button className="clear-filter" onClick={() => { setSearch(''); setCity(''); fetchHotels(); }}>
              ✕ Clear filter: {city}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="section">
        <h2 className="section-title">{city ? `Hotels in ${city}` : 'All Hotels'} <span>{hotels.length} found</span></h2>
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <span>🏨</span>
            <p>No hotels found{city ? ` in "${city}"` : ''}.</p>
          </div>
        ) : (
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                <div className="card-image" style={{ background: `hsl(${(hotel.id * 47) % 360}, 60%, 30%)` }}>
                  <div className="card-city">{hotel.city}</div>
                  <div className="card-price">₹{hotel.price?.toLocaleString()}<span>/night</span></div>
                </div>
                <div className="card-body">
                  <h3>{hotel.name}</h3>
                  <div className="card-address"><FaMapMarkerAlt /> {hotel.address || hotel.city}</div>
                  <div className="card-stars">{renderStars(hotel.rating || 0)}<span>{hotel.rating?.toFixed(1)}</span></div>
                  <p className="card-desc">{hotel.description?.slice(0, 80) || 'A wonderful place to stay.'}…</p>
                  <div className="card-amenities">
                    {AMENITY_ICONS.map((icon, i) => <span key={i} className="amenity-icon">{icon}</span>)}
                  </div>
                  <button className="btn-primary btn-full card-btn" onClick={e => { e.stopPropagation(); navigate(`/hotels/${hotel.id}`); }}>
                    View & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
