import { useParams, Link } from "react-router-dom";
import { products } from "@/lib/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">😢</p>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Product Not Found</h1>
            <Link to="/products" className="text-secondary font-bold">
              ← Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isWished = has(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <nav className="text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-secondary">Home</Link>
            {" / "}
            <Link to="/products" className="hover:text-secondary">Products</Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-card"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              {product.badge && (
                <span className="self-start px-3 py-1 rounded-full gradient-hero text-primary-foreground text-xs font-bold mb-3">
                  {product.badge}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-secondary">{discount}% off</span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    addItem(product);
                    toast.success(`${product.name} added to cart! 🛒`);
                  }}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-full gradient-hero text-primary-foreground font-bold text-sm shadow-toy"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  className={`px-6 py-3.5 rounded-full font-bold text-sm border-2 flex items-center gap-2 transition-colors ${
                    isWished
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-foreground hover:border-accent"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isWished ? "currentColor" : "none"} />
                  {isWished ? "Wishlisted" : "Wishlist"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Shield, text: "Secure Payments" },
                  { icon: RotateCcw, text: "Easy Returns" },
                ].map((f) => (
                  <div key={f.text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted text-center">
                    <f.icon className="w-5 h-5 text-secondary" />
                    <span className="text-[10px] font-bold text-muted-foreground">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-extrabold text-foreground mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
};

export default ProductDetail;
