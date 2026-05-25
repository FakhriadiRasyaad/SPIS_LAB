'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/site-settings', icon: '⚙️', label: 'Pengaturan Situs' },
  { href: '/admin/hero', icon: '🏠', label: 'Hero Section' },
  { href: '/admin/about', icon: '📝', label: 'About Section' },
  { href: '/admin/services', icon: '🔬', label: 'Layanan' },
  { href: '/admin/portfolio', icon: '📁', label: 'Portofolio' },
  { href: '/admin/testimonials', icon: '💬', label: 'Testimoni' },
  { href: '/admin/contact', icon: '📞', label: 'Kontak' },
  { href: '/admin/messages', icon: '📨', label: 'Pesan Masuk' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <a href="/admin/dashboard" className="admin-sidebar-logo">
          <span className="navbar-logo-icon">🔬</span>
          Spis Lab CMS
        </a>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setSidebarOpen(false);
                router.push(item.href);
              }}
            >
              <span className="admin-nav-item-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}

          <div className="admin-nav-divider" />

          <a href="/" className="admin-nav-item" target="_blank" rel="noopener noreferrer">
            <span className="admin-nav-item-icon">🌐</span>
            Lihat Website
          </a>

          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            <span className="admin-nav-item-icon">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {/* Mobile sidebar toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'none', marginBottom: 'var(--space-4)', position: 'fixed', top: 'var(--space-4)', left: 'var(--space-4)', zIndex: 'var(--z-toast)' as unknown as number, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)' }}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        {children}
      </main>
    </div>
  );
}
