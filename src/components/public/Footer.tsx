import { SiteSettings } from '@/types/database';

interface FooterProps {
  data?: SiteSettings | null;
}

export default function Footer({ data }: FooterProps) {
  const footerText = data?.footer_text || '© 2026 Spis Lab. All rights reserved.';
  const socialLinks = data?.social_links || {};

  const socialIcons: Record<string, string> = {
    instagram: '📷',
    facebook: '👤',
    whatsapp: '💬',
    tiktok: '🎵',
    youtube: '▶️',
    linkedin: '💼',
  };

  const activeSocials = Object.entries(socialLinks).filter(
    ([, url]) => url && url !== '#' && url !== ''
  );

  return (
    <footer className="footer" id="footer">
      <div className="container footer-inner">
        <p className="footer-text">{footerText}</p>

        {activeSocials.length > 0 && (
          <div className="footer-socials">
            {activeSocials.map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                title={platform}
              >
                {socialIcons[platform] || '🔗'}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
