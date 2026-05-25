'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AboutSection } from '@/types/database';

export default function AboutEditorPage() {
  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: about } = await supabase.from('about_section').select('*').single();
    setData(about);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('about_section').update({
      title: data.title,
      content: data.content,
      image_url: data.image_url,
      stats: data.stats,
    }).eq('id', data.id);
    setSaving(false);
    setToast(error ? 'error' : 'success');
    setTimeout(() => setToast(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    const supabase = createClient();
    const fileName = `about-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      setData({ ...data, image_url: urlData.publicUrl });
    }
  };

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    if (!data) return;
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setData({ ...data, stats: newStats });
  };

  const addStat = () => {
    if (!data) return;
    setData({ ...data, stats: [...data.stats, { label: '', value: '' }] });
  };

  const removeStat = (index: number) => {
    if (!data) return;
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><h3>Data tidak ditemukan</h3></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>📝 About Section</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Menyimpan...</> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2>Konten</h2>
        <div className="form-group">
          <label className="form-label">Judul Section</label>
          <input className="form-input" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Konten / Deskripsi</label>
          <textarea className="form-textarea" value={data.content} onChange={e => setData({ ...data, content: e.target.value })} style={{ minHeight: '200px' }} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Gambar</h2>
        <div className="form-group">
          <label className="form-label">URL Gambar</label>
          <input className="form-input" value={data.image_url} onChange={e => setData({ ...data, image_url: e.target.value })} placeholder="https://..." />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }} />
          {data.image_url && (
            <div className="image-preview" style={{ marginTop: 'var(--space-3)' }}>
              <img src={data.image_url} alt="About" />
              <button className="image-preview-remove" onClick={() => setData({ ...data, image_url: '' })}>✕</button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <h2>Statistik</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {data.stats.map((stat, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--space-3)', alignItems: 'end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nilai</label>
                <input className="form-input" value={stat.value} onChange={e => updateStat(index, 'value', e.target.value)} placeholder="contoh: 10+" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Label</label>
                <input className="form-input" value={stat.label} onChange={e => updateStat(index, 'label', e.target.value)} placeholder="contoh: Tahun Pengalaman" />
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeStat(index)}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={addStat} style={{ marginTop: 'var(--space-4)' }}>
          + Tambah Statistik
        </button>
      </div>

      {toast && <div className={`toast toast-${toast}`}>{toast === 'success' ? '✅ Berhasil disimpan!' : '❌ Gagal menyimpan.'}</div>}
    </div>
  );
}
