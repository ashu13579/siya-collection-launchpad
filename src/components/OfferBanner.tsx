import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OfferBanner = () => (
  <section className="py-12">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="gradient-teal rounded-2xl p-8 md:p-12 text-center text-secondary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl">🎁</div>
          <div className="absolute bottom-4 right-8 text-6xl">🧸</div>
          <div className="absolute top-1/2 left-1/3 text-4xl">⭐</div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Mega Toy Sale! 🎉</h2>
          <p className="text-lg opacity-90 mb-6 max-w-md mx-auto">
            Get up to <span className="font-extrabold text-primary">40% OFF</span> on all toys. Limited time offer!
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-toy"
          >
            Grab the Deal →
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default OfferBanner;
