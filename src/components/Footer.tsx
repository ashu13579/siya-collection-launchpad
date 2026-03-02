import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🧸</span>
          <span className="text-lg font-extrabold text-background">
            Siya <span className="text-primary">Collection</span>
          </span>
        </div>
        <p className="text-sm leading-relaxed mb-4">
          Your one-stop destination for premium toys, collectibles, and gifts in Kandivali West, Mumbai.
        </p>
        <div className="flex gap-3">
          <a
            href="https://instagram.com/siyacollection"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-background mb-4">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          {[
            { to: "/products", label: "All Products" },
            { to: "/products?category=soft-toys", label: "Soft Toys" },
            { to: "/products?category=rc-toys", label: "RC Toys" },
            { to: "/products?category=collectibles", label: "Collectibles" },
          ].map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-primary transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-background mb-4">Policies</h3>
        <ul className="space-y-2 text-sm">
          {["Privacy Policy", "Refund Policy", "Terms & Conditions", "Shipping Policy"].map((p) => (
            <li key={p}>
              <Link
                to={`/${p.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="hover:text-primary transition-colors"
              >
                {p}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-background mb-4">Contact Us</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            Kandivali West, Mumbai, Maharashtra, India
          </li>
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-primary" />
            <a href="tel:+919773729154" className="hover:text-primary transition-colors">
              +91 97737 29154
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 shrink-0 text-primary" />
            <a href="mailto:hello@siyacollection.in" className="hover:text-primary transition-colors">
              hello@siyacollection.in
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">
      © {new Date().getFullYear()} Siya Collection. All rights reserved.
    </div>
  </footer>
);

export default Footer;
