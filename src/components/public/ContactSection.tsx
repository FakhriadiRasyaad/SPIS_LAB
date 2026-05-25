'use client';

import { useState } from 'react';
import { ContactSection as ContactSectionType } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface ContactProps {
  data?: ContactSectionType | null;
}

export default function ContactSection({ data }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const title = data?.title || 'Hubungi Kami';
  const description = data?.description || 'Butuh layanan pengujian atau konsultasi? Tim kami siap membantu Anda.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Kontak</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{description}</p>
        </div>

        <div className="contact-grid">
          <div className="animate-slide-left">
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Informasi Kontak
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Anda bisa menghubungi kami melalui informasi di bawah ini atau mengisi form di samping.
            </p>

            <div className="contact-info-list">
              {data?.address && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">📍</div>
                  <div className="contact-info-text">
                    <h4>Alamat</h4>
                    <p>{data.address}</p>
                  </div>
                </div>
              )}

              {data?.phone && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">📞</div>
                  <div className="contact-info-text">
                    <h4>Telepon</h4>
                    <p>{data.phone}</p>
                  </div>
                </div>
              )}

              {data?.email && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">✉️</div>
                  <div className="contact-info-text">
                    <h4>Email</h4>
                    <p>{data.email}</p>
                  </div>
                </div>
              )}

              {data?.whatsapp_number && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">💬</div>
                  <div className="contact-info-text">
                    <h4>WhatsApp</h4>
                    <p>
                      <a
                        href={`https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data.whatsapp_number}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {!data?.address && !data?.phone && !data?.email && (
                <p style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                  Informasi kontak akan ditampilkan setelah diatur melalui CMS.
                </p>
              )}
            </div>
          </div>

          <div className="glass-card contact-form animate-slide-right">
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>
              Kirim Pesan
            </h3>

            {success && (
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-success)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-5)',
              }}>
                ✅ Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
              </div>
            )}

            {error && (
              <div className="login-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Nama *</label>
                <input
                  id="contact-name"
                  className="form-input"
                  type="text"
                  placeholder="Nama lengkap"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    className="form-input"
                    type="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Telepon</label>
                  <input
                    id="contact-phone"
                    className="form-input"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Pesan *</label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  placeholder="Tuliskan pesan atau pertanyaan Anda..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Mengirim...
                  </>
                ) : (
                  'Kirim Pesan'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
