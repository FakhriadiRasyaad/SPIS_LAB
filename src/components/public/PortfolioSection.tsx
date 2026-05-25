'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/types/database';

interface PortfolioProps {
  data?: PortfolioItem[];
}

export default function PortfolioSection({ data = [] }: PortfolioProps) {
  const categories = ['Semua', ...Array.from(new Set(data.map(item => item.category)))];
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredItems = activeFilter === 'Semua'
    ? data
    : data.filter(item => item.category === activeFilter);

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section-header">
          <div className="section-label">Portofolio</div>
          <h2 className="section-title">Hasil Kerja Kami</h2>
          <p className="section-subtitle">
            Dokumentasi proyek dan hasil pengujian laboratorium yang telah kami kerjakan.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="portfolio-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`portfolio-filter ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="portfolio-grid">
          {filteredItems.map((item, index) => (
            <div key={item.id} className={`glass-card portfolio-card animate-fade-in-up delay-${(index % 3) + 1}`}>
              <div className="portfolio-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} />
                ) : (
                  <div className="portfolio-image-placeholder">📊</div>
                )}
                <div className="portfolio-overlay">
                  <span style={{ color: 'white', fontSize: 'var(--text-sm)' }}>Lihat Detail</span>
                </div>
              </div>
              <div className="portfolio-info">
                <span className="portfolio-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>Belum ada portofolio</h3>
            <p>Portofolio akan ditampilkan di sini setelah ditambahkan melalui CMS.</p>
          </div>
        )}
      </div>
    </section>
  );
}
