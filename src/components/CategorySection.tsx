import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/lib/products";

const CategorySection = () => (
  <section className="py-16 bg-background">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-foreground mb-2">
        Shop by Category
      </h2>
      <p className="text-center text-muted-foreground mb-10">Find the perfect toy for every age and interest</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/products?category=${cat.id}`}
              className="group block rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3 bg-card text-center">
                <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategorySection;
