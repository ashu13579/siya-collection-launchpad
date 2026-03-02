import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Sharma",
    text: "Amazing collection of toys! My kids absolutely love everything we bought from Siya Collection. Quality is top-notch.",
    rating: 5,
  },
  {
    name: "Rajesh Patel",
    text: "Best toy store in Kandivali! Great prices and the anime collectibles section is incredible. Highly recommended!",
    rating: 5,
  },
  {
    name: "Meera Desai",
    text: "Ordered a birthday gift for my nephew and the packaging was beautiful. Fast delivery and excellent customer service.",
    rating: 4,
  },
];

const TestimonialsSection = () => (
  <section className="py-16 bg-background">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-foreground mb-2">
        💬 What Our Customers Say
      </h2>
      <p className="text-center text-muted-foreground mb-10">Trusted by 1000+ happy families in Mumbai</p>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-xl p-6 shadow-card"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${j < t.rating ? "text-primary fill-primary" : "text-border"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
            <p className="font-bold text-sm text-foreground">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
