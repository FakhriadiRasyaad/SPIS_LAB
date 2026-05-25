'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/types/database';

export default function TestimonialsEditorPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleNew = () => {
    setEditing({
      id: '', client_name: '', client_image_url: '', content: '',
      rating: 5, sort_order: items.length + 1, is_active: true,
      created_at: '', updated_at: '',
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      client_name: editing.client_name, client_image_url: editing.client_image_url,
      content: editing.content, rating: editing.rating,
      sort_order: editing.sort_order, is_active: editing.is_active,
    };

    const { error } = isNew
      ? await supabase.from('testimonials').insert([payload])
      : await supabase.from('testimonials').update(payload).eq('id', editing.id);

    setSaving(false);
    setToast(error ? 'error' : 'success');
    setEditing(null);
    setIsNew(false);
    fetchData();
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return;
    const supabase = createClient();
    await supabase.from('testimonials').delete().eq('id', id);
    fetchData();
  };

  const toggleActive = async (item: Testimonial) => {
    const supabase = createClient();
    await supabase.from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id);
    fetchData();
  };

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? '#fbbf24' : 'var(--color-text-muted)', cursor: 'default' }}>★</span>
  ));

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>💬 Testimoni</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleNew}>+ Tambah Testimoni</button>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>{isNew ? 'Tambah Testimoni Baru' : 'Edit Testimoni'}</h2>

            <div className="form-group">
              <label className="form-label">Nama Klien</label>
              <input className="form-input" value={editing.client_name} onChange={e => setEditing({ ...editing, client_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">URL Foto Klien (opsional)</label>
              <input className="form-input" value={editing.client_image_url} onChange={e => setEditing({ ...editing, client_image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Isi Testimoni</label>
              <textarea className="form-textarea" value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Rating (1-5)</label>
                <div style={{ display: 'flex', gap: '4px', marginTop: 'var(--space-2)' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      onClick={() => setEditing({ ...editing, rating: star })}
                      style={{ fontSize: 'var(--text-xl)', cursor: 'pointer', color: star <= editing.rating ? '#fbbf24' : 'var(--color-text-muted)' }}
                    >★</span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Urutan</label>
                <input className="form-input" type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <div className={`toggle ${editing.is_active ? 'active' : ''}`} onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{editing.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setEditing(null); setIsNew(false); }}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner" /> Menyimpan...</> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Klien</th>
              <th>Testimoni</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><strong>{item.client_name}</strong></td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</td>
                <td>{renderStars(item.rating)}</td>
                <td><div className={`toggle ${item.is_active ? 'active' : ''}`} onClick={() => toggleActive(item)} /></td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(item); setIsNew(false); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Belum ada testimoni</h3>
            <p>Klik &quot;Tambah Testimoni&quot; untuk menambahkan.</p>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil!' : '❌ Gagal.'}</div>}
    </div>
  );
}
