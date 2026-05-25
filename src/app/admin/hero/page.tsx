'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HeroSection } from '@/types/database';

export default function HeroEditorPage() {
  const [data, setData] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: hero } = await supabase.from('hero_section').select('*').single();
    setData(hero);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('hero_section')
      .update({
        headline: data.headline,
        subheadline: data.subheadline,
        description: data.description,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        background_image_url: data.background_image_url,
        is_active: data.is_active,
      })
      .eq('id', data.id);

    setSaving(false);
    setToast(error ? 'error' : 'success');
    setTimeout(() => setToast(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    const supabase = createClient();
    const fileName = `hero-bg-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      setData({ ...data, background_image_url: urlData.publicUrl });
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Data tidak ditemukan</h3></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>🏠 Hero Section</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Menyimpan...</> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2>Konten Hero</h2>
        <div className="form-group">
          <label className="form-label">Sub-headline (Badge)</label>
          <input className="form-input" value={data.subheadline} onChange={e => setData({ ...data, subheadline: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Headline Utama</label>
          <input className="form-input" value={data.headline} onChange={e => setData({ ...data, headline: e.target.value })} style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea className="form-textarea" value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Teks Tombol CTA</label>
            <input className="form-input" value={data.cta_text} onChange={e => setData({ ...data, cta_text: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Link CTA</label>
            <input className="form-input" value={data.cta_link} onChange={e => setData({ ...data, cta_link: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Background Image</h2>
        <div className="form-group">
          <label className="form-label">URL Gambar Background</label>
          <input className="form-input" value={data.background_image_url} onChange={e => setData({ ...data, background_image_url: e.target.value })} placeholder="https://..." />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
          {data.background_image_url && (
            <div className="image-preview" style={{ marginTop: 'var(--space-3)', maxWidth: '500px' }}>
              <img src={data.background_image_url} alt="Hero background" />
              <button className="image-preview-remove" onClick={() => setData({ ...data, background_image_url: '' })}>✕</button>
            </div>
          )}
        </div>
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil disimpan!' : '❌ Gagal menyimpan.'}</div>}
    </div>
  );
}
