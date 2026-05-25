'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (msg: ContactMessage) => {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id);
    setSelected(msg);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;
    const supabase = createClient();
    await supabase.from('contact_messages').delete().eq('id', id);
    setSelected(null);
    fetchData();
  };

  const markAllRead = async () => {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ is_read: true }).eq('is_read', false);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>
          📨 Pesan Masuk
          {unreadCount > 0 && (
            <span className="badge badge-warning" style={{ marginLeft: 'var(--space-3)', verticalAlign: 'middle' }}>
              {unreadCount} belum dibaca
            </span>
          )}
        </h1>
        <div className="admin-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllRead}>
              Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      {/* Message detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h2>Pesan dari {selected.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {selected.email && (
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  <strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
              )}
              {selected.phone && (
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  <strong>Telepon:</strong> {selected.phone}
                </div>
              )}
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                {formatDate(selected.created_at)}
              </div>
            </div>
            <div style={{
              padding: 'var(--space-5)',
              background: 'var(--color-bg-glass)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}>
              {selected.message}
            </div>
            <div className="modal-actions" style={{ marginTop: 'var(--space-6)' }}>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Hapus</button>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Tutup</button>
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="btn btn-primary">Balas via Email</a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        {messages.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nama</th>
                <th>Email</th>
                <th>Pesan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} style={{ fontWeight: msg.is_read ? 'normal' : '600', cursor: 'pointer' }} onClick={() => markAsRead(msg)}>
                  <td>
                    {!msg.is_read && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                    )}
                  </td>
                  <td>{msg.name}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{msg.email || '-'}</td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</td>
                  <td style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                    {formatDate(msg.created_at)}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); markAsRead(msg); }}>Lihat</button>
                      <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📨</div>
            <h3>Belum ada pesan masuk</h3>
            <p>Pesan yang dikirim melalui form kontak di website akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
