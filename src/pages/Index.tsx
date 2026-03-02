import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import OfferBanner from "@/components/OfferBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <>
    <Header />
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <OfferBanner />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
    <Footer />
    <CartDrawer />
    <WhatsAppButton />
  </>
);

export default Index;
