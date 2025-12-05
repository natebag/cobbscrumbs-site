import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ThisWeekSection from '@/components/ThisWeekSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import CartDrawer from '@/components/CartDrawer';

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Header />

      {/* Hero Section - fetched from database */}
      <HeroSection />

      {/* This Week Section - fetched from database */}
      <ThisWeekSection />

      {/* About Section - fetched from database */}
      <AboutSection />

      {/* Contact Section - fetched from database */}
      <ContactSection />

      <Footer />

      <CartDrawer />
    </main>
  );
}
