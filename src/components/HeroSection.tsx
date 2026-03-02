import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-toys.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Siya Collection - Premium Toys" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
    </div>

    <div className="container relative z-10 py-20 md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold mb-4">
          🎁 New Arrivals — Up to 40% Off
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-background leading-tight mb-4">
          Where Every Toy Tells a <span className="text-primary">Story</span>
        </h1>
        <p className="text-background/80 text-lg mb-8 leading-relaxed">
          Discover premium toys, collectibles, and gifts at Siya Collection — Mumbai's favourite toy store.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="px-8 py-3.5 rounded-full gradient-hero text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-toy"
          >
            Shop Now →
          </Link>
          <Link
            to="/products?category=collectibles"
            className="px-8 py-3.5 rounded-full bg-background/15 backdrop-blur-sm text-background font-bold text-sm border border-background/30 hover:bg-background/25 transition-colors"
          >
            Explore Collectibles
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
