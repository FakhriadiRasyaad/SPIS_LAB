import { HeroSection as HeroSectionType } from '@/types/database';

interface HeroProps {
  data?: HeroSectionType | null;
}

export default function HeroSection({ data }: HeroProps) {
  const headline = data?.headline || 'Precision. Innovation. Excellence.';
  const subheadline = data?.subheadline || 'Spis Lab';
  const description = data?.description || 'Laboratorium terakreditasi dengan layanan pengujian dan analisis terlengkap.';
  const ctaText = data?.cta_text || 'Layanan Kami';
  const ctaLink = data?.cta_link || '#services';
  const bgImage = data?.background_image_url;

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        {bgImage && <div className="hero-bg-image" style={{ backgroundImage: `url(${bgImage})` }} />}
        <div className="hero-grid" />
      </div>

      <div className="container hero-content">
        <div className="animate-fade-in-up">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            {subheadline}
          </span>
        </div>

        <h1 className="hero-headline animate-fade-in-up delay-1">
          {headline}
        </h1>

        <p className="hero-description animate-fade-in-up delay-2">
          {description}
        </p>

        <div className="hero-actions animate-fade-in-up delay-3">
          <a href={ctaLink} className="btn btn-primary btn-lg">
            {ctaText}
          </a>
          <a href="#about" className="btn btn-secondary btn-lg">
            Tentang Kami
          </a>
        </div>
      </div>
    </section>
  );
}
