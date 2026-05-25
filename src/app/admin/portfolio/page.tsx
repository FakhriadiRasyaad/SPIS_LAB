'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PortfolioItem } from '@/types/database';

export default function PortfolioEditorPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('portfolio_items').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleNew = () => {
    setEditing({
      id: '', title: '', description: '', image_url: '', category: 'Lainnya',
      before_image_url: '', after_image_url: '',
      sort_order: items.length + 1, is_active: true,
      created_at: '', updated_at: '',
    });
    setIsNew(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'before_image_url' | 'after_image_url') => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const supabase = createClient();
    const fileName = `portfolio-${field}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      setEditing({ ...editing, [field]: urlData.publicUrl });
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: editing.title, description: editing.description, image_url: editing.image_url,
      category: editing.category, before_image_url: editing.before_image_url,
      after_image_url: editing.after_image_url, sort_order: editing.sort_order, is_active: editing.is_active,
    };

    const { error } = isNew
      ? await supabase.from('portfolio_items').insert([payload])
      : await supabase.from('portfolio_items').update(payload).eq('id', editing.id);

    setSaving(false);
    setToast(error ? 'error' : 'success');
    setEditing(null);
    setIsNew(false);
    fetchData();
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    const supabase = createClient();
    await supabase.from('portfolio_items').delete().eq('id', id);
    fetchData();
  };

  const toggleActive = async (item: PortfolioItem) => {
    const supabase = createClient();
    await supabase.from('portfolio_items').update({ is_active: !item.is_active }).eq('id', item.id);
    fetchData();
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>📁 Portofolio</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleNew}>+ Tambah Portofolio</button>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{isNew ? 'Tambah Portofolio Baru' : 'Edit Portofolio'}</h2>

            <div className="form-group">
              <label className="form-label">Judul</label>
              <input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <input className="form-input" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="contoh: Analisis Kimia" />
              </div>
              <div className="form-group">
                <label className="form-label">Urutan</label>
                <input className="form-input" type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Gambar Utama</label>
              <input className="form-input" value={editing.image_url} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'image_url')} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
              {editing.image_url && <div className="image-preview" style={{ marginTop: 'var(--space-3)' }}><img src={editing.image_url} alt="Preview" /></div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Gambar Before (opsional)</label>
                <input className="form-input" value={editing.before_image_url} onChange={e => setEditing({ ...editing, before_image_url: e.target.value })} />
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'before_image_url')} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Gambar After (opsional)</label>
                <input className="form-input" value={editing.after_image_url} onChange={e => setEditing({ ...editing, after_image_url: e.target.value })} />
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'after_image_url')} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className={`toggle ${editing.is_active ? 'active' : ''}`} onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{editing.is_active ? 'Aktif' : 'Nonaktif'}</span>
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
              <th>Gambar</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  ) : (
                    <div style={{ width: '60px', height: '45px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊</div>
                  )}
                </td>
                <td><strong>{item.title}</strong></td>
                <td><span className="badge badge-info">{item.category}</span></td>
                <td>{item.sort_order}</td>
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
            <div className="empty-state-icon">📁</div>
            <h3>Belum ada portofolio</h3>
            <p>Klik tombol &quot;Tambah Portofolio&quot; untuk menambahkan item baru.</p>
          </div>
        )}
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil!' : '❌ Gagal.'}</div>}
    </div>
  );
}
