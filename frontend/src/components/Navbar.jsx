import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaSignOutAlt, FaUser, FaCalendarCheck, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logoutUser();
    navigate('/login');
  }

  const isActive = (path) => pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FaHotel className="brand-icon" />
        <span>StayEase</span>
      </div>
      <div className="nav-links">
        <Link to="/hotels" className={isActive('/hotels')}>Hotels</Link>
        {user && <Link to="/bookings" className={isActive('/bookings')}>My Bookings</Link>}
        {user && <Link to="/profile" className={isActive('/profile')}>Profile</Link>}
        {user?.role === 'ADMIN' && <Link to="/admin" className={isActive('/admin')}>Admin</Link>}
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">
              <FaUser /> {user.email}
              {user.role === 'ADMIN' && <span className="badge-admin">ADMIN</span>}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
