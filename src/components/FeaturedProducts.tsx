import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => (
  <section className="py-16 bg-muted/50">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-foreground mb-2">
        ✨ Featured Products
      </h2>
      <p className="text-center text-muted-foreground mb-10">Handpicked bestsellers just for you</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
