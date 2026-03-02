import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon 💌");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <h1 className="text-3xl font-extrabold text-foreground text-center mb-2">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-10">We'd love to hear from you!</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Visit Us", text: "Kandivali West, Mumbai, Maharashtra, India" },
                { icon: Phone, title: "Call Us", text: "+91 97737 29154" },
                { icon: Mail, title: "Email Us", text: "hello@siyacollection.in" },
                { icon: Clock, title: "Working Hours", text: "Mon–Sat: 10am – 9pm" },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}

              <a
                href="https://instagram.com/siyacollection"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(340,70%,55%)] to-[hsl(25,95%,58%)] text-white font-bold text-sm"
              >
                <Instagram className="w-4 h-4" /> Follow on Instagram
              </a>

              {/* Google Maps */}
              <div className="rounded-xl overflow-hidden shadow-card aspect-video">
                <iframe
                  title="Siya Collection Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.7!2d72.84!3d19.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzAwLjAiTiA3MsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v1600000000000"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-card space-y-4">
              <h2 className="text-lg font-extrabold text-foreground">Send a Message</h2>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                maxLength={255}
                className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
              />
              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={1000}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full gradient-hero text-primary-foreground font-bold text-sm"
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
};

export default Contact;
