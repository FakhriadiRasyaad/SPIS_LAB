'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactSection } from '@/types/database';

export default function ContactEditorPage() {
  const [data, setData] = useState<ContactSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: contact } = await supabase.from('contact_section').select('*').single();
    setData(contact);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('contact_section').update({
      title: data.title, description: data.description,
      address: data.address, phone: data.phone, email: data.email,
      map_embed_url: data.map_embed_url, whatsapp_number: data.whatsapp_number,
    }).eq('id', data.id);

    setSaving(false);
    setToast(error ? 'error' : 'success');
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Data tidak ditemukan</h3></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>📞 Informasi Kontak</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Menyimpan...</> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2>Section Kontak</h2>
        <div className="form-group">
          <label className="form-label">Judul Section</label>
          <input className="form-input" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea className="form-textarea" value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Detail Kontak</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">📍 Alamat</label>
            <textarea className="form-textarea" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} style={{ minHeight: '80px' }} placeholder="Jl. Contoh No. 123, Kota" />
          </div>
          <div className="form-group">
            <label className="form-label">📞 Telepon</label>
            <input className="form-input" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} placeholder="(021) 1234567" />
          </div>
          <div className="form-group">
            <label className="form-label">✉️ Email</label>
            <input className="form-input" type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} placeholder="info@spislab.com" />
          </div>
          <div className="form-group">
            <label className="form-label">💬 Nomor WhatsApp</label>
            <input className="form-input" value={data.whatsapp_number} onChange={e => setData({ ...data, whatsapp_number: e.target.value })} placeholder="628xxxxxxxxxx" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">🗺️ Google Maps Embed URL</label>
          <input className="form-input" value={data.map_embed_url} onChange={e => setData({ ...data, map_embed_url: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
          {data.map_embed_url && (
            <div style={{ marginTop: 'var(--space-4)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <iframe src={data.map_embed_url} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          )}
        </div>
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil disimpan!' : '❌ Gagal menyimpan.'}</div>}
    </div>
  );
}
