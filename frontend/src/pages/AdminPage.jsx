import { useEffect, useState } from 'react';
import { getAllHotels, addHotel, updateHotel, deleteHotel } from '../api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaHotel } from 'react-icons/fa';

const EMPTY = { name: '', city: '', address: '', price: '', rating: '', description: '' };

export default function AdminPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels() {
    try { const r = await getAllHotels(); setHotels(r.data); }
    catch { toast.error('Failed to load hotels'); }
    finally { setLoading(false); }
  }

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(h) {
    setEditing(h.id);
    setForm({ name: h.name, city: h.city, address: h.address || '', price: h.price, rating: h.rating, description: h.description || '' });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), rating: Number(form.rating) };
      if (editing) { await updateHotel(editing, data); toast.success('Hotel updated!'); }
      else { await addHotel(data); toast.success('Hotel added!'); }
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this hotel?')) return;
    try { await deleteHotel(id); toast.success('Deleted'); fetchHotels(); }
    catch { toast.error('Delete failed'); }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1><FaHotel /> Hotel Management</h1>
        <button className="btn-primary" onClick={openAdd}><FaPlus /> Add Hotel</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Hotel' : 'Add Hotel'}</h2>
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Grand Palace" />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required placeholder="Mumbai" />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123, MG Road" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price/Night (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="2500" />
                </div>
                <div className="form-group">
                  <label>Rating (1–5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the hotel…" />
              </div>
              <div className="form-row">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Hotel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>City</th><th>Price</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {hotels.length === 0 ? (
              <tr><td colSpan={6} className="table-empty">No hotels yet. Add one!</td></tr>
            ) : hotels.map(h => (
              <tr key={h.id}>
                <td>#{h.id}</td>
                <td><strong>{h.name}</strong></td>
                <td>{h.city}</td>
                <td>₹{h.price?.toLocaleString()}</td>
                <td>{'★'.repeat(Math.round(h.rating || 0))} {h.rating?.toFixed(1)}</td>
                <td className="table-actions">
                  <button className="btn-icon edit" onClick={() => openEdit(h)}><FaEdit /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(h.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
