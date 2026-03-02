import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X, Phone } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const count = totalItems();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/products?category=soft-toys", label: "Soft Toys" },
    { to: "/products?category=rc-toys", label: "RC Toys" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="gradient-hero text-primary-foreground text-xs py-1.5 text-center font-semibold tracking-wide">
        🎉 Free Delivery on orders above ₹999 | Use code SIYA10 for 10% off!
      </div>

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-card">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <span className="text-xl font-extrabold text-foreground">
              Siya <span className="text-secondary">Collection</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919773729154"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-secondary"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 97737 29154
            </a>
            <button
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={toggleCart}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </button>
            <Link to="/wishlist" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <nav className="flex flex-col p-4 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-foreground py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
