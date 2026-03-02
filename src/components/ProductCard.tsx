import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "@/lib/store";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-shadow"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 gradient-hero text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isWished ? "bg-accent text-accent-foreground" : "bg-card/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className="w-4 h-4" fill={isWished ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-muted-foreground line-through ml-1.5">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-secondary ml-1">{discount}% off</span>
              </>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to cart! 🛒`);
            }}
            className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
