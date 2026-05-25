import { Testimonial } from '@/types/database';

interface TestimonialsProps {
  data?: Testimonial[];
}

export default function TestimonialsSection({ data = [] }: TestimonialsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="testimonial-star">
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section className="section" id="testimonials" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Testimoni</div>
          <h2 className="section-title">Apa Kata Klien Kami</h2>
          <p className="section-subtitle">
            Kepercayaan dan kepuasan klien adalah prioritas utama kami.
          </p>
        </div>

        <div className="testimonials-grid">
          {data.map((testimonial, index) => (
            <div key={testimonial.id} className={`glass-card testimonial-card animate-fade-in-up delay-${(index % 3) + 1}`}>
              <div className="testimonial-quote">&ldquo;</div>
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
              <div className="testimonial-author">
                {testimonial.client_image_url ? (
                  <img
                    src={testimonial.client_image_url}
                    alt={testimonial.client_name}
                    className="testimonial-avatar"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="testimonial-avatar">
                    {getInitials(testimonial.client_name)}
                  </div>
                )}
                <span className="testimonial-name">{testimonial.client_name}</span>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Belum ada testimoni</h3>
            <p>Testimoni akan ditampilkan setelah ditambahkan melalui CMS.</p>
          </div>
        )}
      </div>
    </section>
  );
}
