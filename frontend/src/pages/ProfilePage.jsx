import { useState, useEffect } from 'react';
import { getMyProfile, createUserProfile, updateUserProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaEdit, FaSave } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then(r => { setProfile(r.data); setForm({ name: r.data.name || '', location: r.data.location || '' }); setHasProfile(true); })
      .catch(() => { setHasProfile(false); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (hasProfile) {
        const res = await updateUserProfile(user.userId, form);
        setProfile(res.data);
        toast.success('Profile updated!');
      } else {
        const res = await createUserProfile(form);
        setProfile(res.data);
        setHasProfile(true);
        toast.success('Profile created!');
      }
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">
            {(profile?.name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1>{profile?.name || 'Complete your profile'}</h1>
            <span className="profile-role">{user?.role}</span>
          </div>

          <div className="profile-body">
            <div className="profile-field">
              <FaEnvelope className="field-icon" />
              <div>
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
            </div>

            {!editing ? (
              <>
                <div className="profile-field">
                  <FaUser className="field-icon" />
                  <div>
                    <label>Name</label>
                    <p>{profile?.name || <span className="empty">Not set</span>}</p>
                  </div>
                </div>
                <div className="profile-field">
                  <FaMapMarkerAlt className="field-icon" />
                  <div>
                    <label>Location</label>
                    <p>{profile?.location || <span className="empty">Not set</span>}</p>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSave} className="auth-form">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
                </div>
                <div className="form-row">
                  <button type="button" className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
