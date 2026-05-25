// ============================================
// Database Types for Supabase
// ============================================

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  footer_text: string;
  social_links: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  headline: string;
  subheadline: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string;
  image_url: string;
  stats: { label: string; value: string }[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_image_url: string;
  content: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSection {
  id: string;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  map_embed_url: string;
  whatsapp_number: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CustomSection {
  id: string;
  section_key: string;
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
