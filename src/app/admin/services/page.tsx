'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Service } from '@/types/database';

export default function ServicesEditorPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleNew = () => {
    setEditing({
      id: '', title: '', description: '', icon: '🔬',
      sort_order: items.length + 1, is_active: true,
      created_at: '', updated_at: '',
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();

    if (isNew) {
      const { error } = await supabase.from('services').insert([{
        title: editing.title, description: editing.description,
        icon: editing.icon, sort_order: editing.sort_order, is_active: editing.is_active,
      }]);
      if (error) { setToast('error'); } else { setToast('success'); }
    } else {
      const { error } = await supabase.from('services').update({
        title: editing.title, description: editing.description,
        icon: editing.icon, sort_order: editing.sort_order, is_active: editing.is_active,
      }).eq('id', editing.id);
      if (error) { setToast('error'); } else { setToast('success'); }
    }

    setSaving(false);
    setEditing(null);
    setIsNew(false);
    fetchData();
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    const supabase = createClient();
    await supabase.from('services').delete().eq('id', id);
    fetchData();
    setToast('success');
    setTimeout(() => setToast(''), 3000);
  };

  const toggleActive = async (item: Service) => {
    const supabase = createClient();
    await supabase.from('services').update({ is_active: !item.is_active }).eq('id', item.id);
    fetchData();
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>🔬 Layanan</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleNew}>+ Tambah Layanan</button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>{isNew ? 'Tambah Layanan Baru' : 'Edit Layanan'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <input className="form-input" value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} style={{ textAlign: 'center', fontSize: 'var(--text-xl)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Judul</label>
                <input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Urutan</label>
                <input className="form-input" type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <div className={`toggle ${editing.is_active ? 'active' : ''}`} onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{editing.is_active ? 'Aktif' : 'Nonaktif'}</span>
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
              <th>Icon</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontSize: 'var(--text-xl)' }}>{item.icon}</td>
                <td><strong>{item.title}</strong></td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
                <td>{item.sort_order}</td>
                <td>
                  <div className={`toggle ${item.is_active ? 'active' : ''}`} onClick={() => toggleActive(item)} />
                </td>
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
            <div className="empty-state-icon">🔬</div>
            <h3>Belum ada layanan</h3>
            <p>Klik tombol &quot;Tambah Layanan&quot; untuk menambahkan layanan baru.</p>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil!' : '❌ Gagal.'}</div>}
    </div>
  );
}
