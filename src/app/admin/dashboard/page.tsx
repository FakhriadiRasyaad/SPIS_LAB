'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DashboardStats {
  services: number;
  portfolio: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    portfolio: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [
        { count: servicesCount },
        { count: portfolioCount },
        { count: testimonialsCount },
        { count: messagesCount },
        { count: unreadCount },
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ]);

      setStats({
        services: servicesCount || 0,
        portfolio: portfolioCount || 0,
        testimonials: testimonialsCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p style={{ color: 'var(--color-text-secondary)' }}>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card-icon">🔬</div>
          <div className="stat-card-value">{stats.services}</div>
          <div className="stat-card-label">Layanan</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card-icon">📁</div>
          <div className="stat-card-value">{stats.portfolio}</div>
          <div className="stat-card-label">Portofolio</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card-icon">💬</div>
          <div className="stat-card-value">{stats.testimonials}</div>
          <div className="stat-card-label">Testimoni</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card-icon">📨</div>
          <div className="stat-card-value">{stats.messages}</div>
          <div className="stat-card-label">
            Pesan
            {stats.unreadMessages > 0 && (
              <span className="badge badge-warning" style={{ marginLeft: 'var(--space-2)' }}>
                {stats.unreadMessages} baru
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Selamat Datang di CMS Spis Lab 👋</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
          Gunakan menu di sebelah kiri untuk mengelola konten website Anda. Semua perubahan yang Anda buat akan langsung terlihat di halaman publik.
        </p>
        <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <strong>⚙️ Pengaturan Situs</strong>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
              Ubah judul, deskripsi, logo, dan social media links.
            </p>
          </div>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <strong>🏠 Hero & About</strong>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
              Edit headline, deskripsi, dan gambar di section utama.
            </p>
          </div>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <strong>📁 Konten</strong>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
              Kelola layanan, portofolio, testimoni, dan informasi kontak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
