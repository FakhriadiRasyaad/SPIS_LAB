-- ============================================
-- SPIS LAB — Portfolio CMS Database Schema
-- Laboratory Portfolio
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SITE SETTINGS
-- ============================================
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Spis Lab',
  site_description TEXT DEFAULT 'Laboratorium Profesional — Pengujian, Analisis & Riset Berkualitas Tinggi',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT '© 2026 Spis Lab. All rights reserved.',
  social_links JSONB DEFAULT '{
    "instagram": "",
    "whatsapp": "",
    "facebook": "",
    "tiktok": "",
    "youtube": "",
    "linkedin": ""
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. HERO SECTION
-- ============================================
CREATE TABLE public.hero_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL DEFAULT 'Precision. Innovation. Excellence.',
  subheadline TEXT DEFAULT 'Spis Lab',
  description TEXT DEFAULT 'Laboratorium terakreditasi dengan layanan pengujian dan analisis terlengkap. Didukung teknologi mutakhir dan tim ahli berpengalaman.',
  cta_text TEXT DEFAULT 'Layanan Kami',
  cta_link TEXT DEFAULT '#services',
  background_image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ABOUT SECTION
-- ============================================
CREATE TABLE public.about_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Tentang Spis Lab',
  content TEXT DEFAULT 'Spis Lab adalah laboratorium profesional yang menyediakan layanan pengujian, analisis, dan riset dengan standar kualitas tertinggi. Dilengkapi dengan peralatan modern dan didukung oleh tim ilmuwan serta teknisi berpengalaman, kami berkomitmen memberikan hasil yang akurat, terpercaya, dan tepat waktu untuk mendukung kebutuhan industri dan penelitian.',
  image_url TEXT DEFAULT '',
  stats JSONB DEFAULT '[
    {"label": "Tahun Berdiri", "value": "10+"},
    {"label": "Sampel Diuji", "value": "50K+"},
    {"label": "Klien Industri", "value": "200+"},
    {"label": "Akreditasi", "value": "ISO"}
  ]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SERVICES
-- ============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🔬',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. PORTFOLIO ITEMS
-- ============================================
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'Lainnya',
  before_image_url TEXT DEFAULT '',
  after_image_url TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TESTIMONIALS
-- ============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_image_url TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CONTACT SECTION
-- ============================================
CREATE TABLE public.contact_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Hubungi Kami',
  description TEXT DEFAULT 'Butuh layanan pengujian atau konsultasi? Tim kami siap membantu Anda.',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  map_embed_url TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. CONTACT MESSAGES
-- ============================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. CUSTOM SECTIONS
-- ============================================
CREATE TABLE public.custom_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_sections ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read hero_section" ON public.hero_section FOR SELECT USING (true);
CREATE POLICY "Public read about_section" ON public.about_section FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read portfolio_items" ON public.portfolio_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read contact_section" ON public.contact_section FOR SELECT USING (true);
CREATE POLICY "Public read custom_sections" ON public.custom_sections FOR SELECT USING (is_active = true);

-- PUBLIC INSERT for contact messages
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- AUTHENTICATED full access
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access hero_section" ON public.hero_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access about_section" ON public.about_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access portfolio_items" ON public.portfolio_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access contact_section" ON public.contact_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access custom_sections" ON public.custom_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Authenticated update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Authenticated delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_hero_section BEFORE UPDATE ON public.hero_section FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_about_section BEFORE UPDATE ON public.about_section FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_portfolio_items BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_contact_section BEFORE UPDATE ON public.contact_section FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_custom_sections BEFORE UPDATE ON public.custom_sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO public.site_settings (site_title, site_description, footer_text, social_links) VALUES (
  'Spis Lab',
  'Laboratorium Profesional — Pengujian, Analisis & Riset Berkualitas Tinggi',
  '© 2026 Spis Lab. All rights reserved.',
  '{"instagram": "#", "whatsapp": "#", "facebook": "#", "linkedin": "#"}'::jsonb
);

INSERT INTO public.hero_section (headline, subheadline, description, cta_text, cta_link) VALUES (
  'Precision. Innovation. Excellence.',
  'Spis Lab',
  'Laboratorium terakreditasi dengan layanan pengujian dan analisis terlengkap. Didukung teknologi mutakhir dan tim ahli berpengalaman.',
  'Layanan Kami',
  '#services'
);

INSERT INTO public.about_section (title, content, stats) VALUES (
  'Tentang Spis Lab',
  'Spis Lab adalah laboratorium profesional yang menyediakan layanan pengujian, analisis, dan riset dengan standar kualitas tertinggi. Dilengkapi dengan peralatan modern dan didukung oleh tim ilmuwan serta teknisi berpengalaman, kami berkomitmen memberikan hasil yang akurat, terpercaya, dan tepat waktu untuk mendukung kebutuhan industri dan penelitian.',
  '[{"label": "Tahun Berdiri", "value": "10+"}, {"label": "Sampel Diuji", "value": "50K+"}, {"label": "Klien Industri", "value": "200+"}, {"label": "Akreditasi", "value": "ISO"}]'::jsonb
);

INSERT INTO public.services (title, description, icon, sort_order) VALUES
  ('Analisis Kimia', 'Pengujian komposisi kimia, kandungan unsur, dan analisis kualitatif maupun kuantitatif dengan instrumen presisi tinggi.', '⚗️', 1),
  ('Pengujian Mikrobiologi', 'Uji mikroba, sterilitas, dan kontaminasi biologis untuk produk farmasi, makanan, dan kosmetik.', '🦠', 2),
  ('Kalibrasi Instrumen', 'Layanan kalibrasi peralatan laboratorium dan industri sesuai standar nasional dan internasional.', '📐', 3),
  ('Analisis Lingkungan', 'Pengujian kualitas air, udara, dan tanah untuk memastikan kepatuhan terhadap regulasi lingkungan.', '🌿', 4),
  ('Pengujian Material', 'Uji kekuatan, komposisi, dan karakteristik material logam, polimer, dan komposit.', '🔩', 5),
  ('Riset & Pengembangan', 'Dukungan riset kolaboratif dengan institusi akademik dan industri untuk inovasi produk.', '🔬', 6);

INSERT INTO public.contact_section (title, description, whatsapp_number) VALUES (
  'Hubungi Kami',
  'Butuh layanan pengujian atau konsultasi laboratorium? Tim kami siap membantu Anda dengan solusi terbaik.',
  ''
);

INSERT INTO public.testimonials (client_name, content, rating, sort_order) VALUES
  ('PT. Kimia Farma', 'Hasil analisis dari Spis Lab selalu akurat dan tepat waktu. Sangat membantu proses quality control produk kami.', 5, 1),
  ('Universitas Indonesia', 'Kolaborasi riset yang sangat produktif. Fasilitas laboratorium lengkap dan tim yang kompeten.', 5, 2),
  ('PT. Indofood', 'Layanan pengujian mikrobiologi yang sangat profesional. Laporan detail dan mudah dipahami.', 5, 3);
