'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types/database';

export default function SiteSettingsPage() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: settings } = await supabase.from('site_settings').select('*').single();
    setData(settings);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('site_settings')
      .update({
        site_title: data.site_title,
        site_description: data.site_description,
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
        footer_text: data.footer_text,
        social_links: data.social_links,
      })
      .eq('id', data.id);

    setSaving(false);
    if (error) {
      setToast('error');
    } else {
      setToast('success');
    }
    setTimeout(() => setToast(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'favicon_url') => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    const supabase = createClient();
    const fileName = `${field}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);

    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      setData({ ...data, [field]: urlData.publicUrl });
    }
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner" /><p style={{ color: 'var(--color-text-secondary)' }}>Memuat...</p></div>;
  }

  if (!data) {
    return <div className="empty-state"><h3>Data tidak ditemukan</h3><p>Pastikan seed data sudah dijalankan di Supabase.</p></div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>⚙️ Pengaturan Situs</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Menyimpan...</> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2>Informasi Umum</h2>
        <div className="form-group">
          <label className="form-label">Judul Situs</label>
          <input className="form-input" value={data.site_title} onChange={e => setData({ ...data, site_title: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi Situs</label>
          <textarea className="form-textarea" value={data.site_description} onChange={e => setData({ ...data, site_description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Teks Footer</label>
          <input className="form-input" value={data.footer_text} onChange={e => setData({ ...data, footer_text: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Logo & Favicon</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label">Logo URL</label>
            <input className="form-input" value={data.logo_url} onChange={e => setData({ ...data, logo_url: e.target.value })} placeholder="https://..." />
            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
            {data.logo_url && <div className="image-preview" style={{ marginTop: 'var(--space-3)' }}><img src={data.logo_url} alt="Logo" /></div>}
          </div>
          <div className="form-group">
            <label className="form-label">Favicon URL</label>
            <input className="form-input" value={data.favicon_url} onChange={e => setData({ ...data, favicon_url: e.target.value })} placeholder="https://..." />
            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'favicon_url')} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
            {data.favicon_url && <div className="image-preview" style={{ marginTop: 'var(--space-3)' }}><img src={data.favicon_url} alt="Favicon" /></div>}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Social Media Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          {Object.entries(data.social_links || {}).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
              <input
                className="form-input"
                value={value || ''}
                onChange={e => setData({
                  ...data,
                  social_links: { ...data.social_links, [key]: e.target.value },
                })}
                placeholder={`https://${key}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast}`}>
          {toast === 'success' ? '✅ Berhasil disimpan!' : '❌ Gagal menyimpan.'}
        </div>
      )}
    </div>
  );
}
