import { AboutSection as AboutSectionType } from '@/types/database';

interface AboutProps {
  data?: AboutSectionType | null;
}

export default function AboutSection({ data }: AboutProps) {
  const title = data?.title || 'Tentang Spis Lab';
  const content = data?.content || '';
  const imageUrl = data?.image_url;
  const stats = data?.stats || [];

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper animate-slide-left">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="about-image-placeholder">🔬</div>
            )}
          </div>

          <div className="about-content animate-slide-right">
            <div className="section-label">Tentang Kami</div>
            <h2>{title}</h2>
            <p>{content}</p>

            {stats.length > 0 && (
              <div className="about-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="about-stat">
                    <span className="about-stat-value">{stat.value}</span>
                    <span className="about-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
