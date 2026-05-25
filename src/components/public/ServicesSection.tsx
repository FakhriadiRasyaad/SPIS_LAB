import { Service } from '@/types/database';

interface ServicesProps {
  data?: Service[];
}

export default function ServicesSection({ data = [] }: ServicesProps) {
  return (
    <section className="section" id="services" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Layanan Kami</div>
          <h2 className="section-title">Layanan Laboratorium</h2>
          <p className="section-subtitle">
            Kami menyediakan berbagai layanan pengujian dan analisis dengan standar kualitas tertinggi.
          </p>
        </div>

        <div className="services-grid">
          {data.map((service, index) => (
            <div
              key={service.id}
              className={`glass-card service-card animate-fade-in-up delay-${index + 1}`}
            >
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}

          {data.length === 0 && (
            <>
              {[
                { icon: '⚗️', title: 'Analisis Kimia', desc: 'Pengujian komposisi kimia dengan instrumen presisi tinggi.' },
                { icon: '🦠', title: 'Pengujian Mikrobiologi', desc: 'Uji mikroba dan sterilitas untuk produk farmasi dan makanan.' },
                { icon: '🔬', title: 'Riset & Pengembangan', desc: 'Dukungan riset kolaboratif untuk inovasi produk.' },
              ].map((s, i) => (
                <div key={i} className={`glass-card service-card animate-fade-in-up delay-${i + 1}`}>
                  <span className="service-icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
