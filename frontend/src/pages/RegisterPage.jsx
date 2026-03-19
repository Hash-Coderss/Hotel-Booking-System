import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import toast from 'react-hot-toast';
import { FaHotel, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || (typeof err.response?.data === 'string' ? err.response.data : 'Registration failed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <FaHotel className="auth-logo" />
          <h1>StayEase</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required minLength={6}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selector">
              {['USER', 'ADMIN'].map(r => (
                <button
                  key={r} type="button"
                  className={`role-btn ${form.role === r ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  {r === 'USER' ? '👤 Guest' : '🏨 Admin'}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
