import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import ServicesSection from '@/components/public/ServicesSection';
import PortfolioSection from '@/components/public/PortfolioSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch all CMS data in parallel
  const [
    { data: siteSettings },
    { data: heroData },
    { data: aboutData },
    { data: services },
    { data: portfolioItems },
    { data: testimonials },
    { data: contactData },
  ] = await Promise.all([
    supabase.from('site_settings').select('*').single(),
    supabase.from('hero_section').select('*').eq('is_active', true).single(),
    supabase.from('about_section').select('*').single(),
    supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('portfolio_items').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('contact_section').select('*').single(),
  ]);

  return (
    <>
      <Navbar
        siteName={siteSettings?.site_title}
        logoUrl={siteSettings?.logo_url}
      />
      <main>
        <HeroSection data={heroData} />
        <AboutSection data={aboutData} />
        <ServicesSection data={services || []} />
        <PortfolioSection data={portfolioItems || []} />
        <TestimonialsSection data={testimonials || []} />
        <ContactSection data={contactData} />
      </main>
      <Footer data={siteSettings} />
    </>
  );
}
