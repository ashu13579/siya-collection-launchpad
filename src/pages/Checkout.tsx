import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

const Checkout = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: user?.email || "",
    address1: "", address2: "", city: "", state: "Maharashtra", pincode: "",
    gstNumber: "", paymentMethod: "cod" as string,
  });

  const subtotal = totalPrice();
  const shippingCharge = subtotal >= 999 ? 0 : 49;
  const gstAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shippingCharge - discount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      toast.error("Invalid coupon code");
      return;
    }
    if (data.usage_limit && data.used_count >= data.usage_limit) {
      toast.error("Coupon usage limit reached");
      return;
    }
    if (data.min_order_amount && subtotal < Number(data.min_order_amount)) {
      toast.error(`Min order ₹${data.min_order_amount} required`);
      return;
    }

    let disc = data.discount_type === "percentage"
      ? (subtotal * Number(data.discount_value)) / 100
      : Number(data.discount_value);
    if (data.max_discount) disc = Math.min(disc, Number(data.max_discount));
    setDiscount(Math.round(disc));
    setCouponId(data.id);
    toast.success(`Coupon applied! You save ₹${Math.round(disc)}`);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setLoading(true);

    const shippingAddress = {
      full_name: form.fullName, phone: form.phone,
      address_line1: form.address1, address_line2: form.address2,
      city: form.city, state: form.state, pincode: form.pincode,
    };

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        guest_email: !user ? form.email : null,
        guest_phone: !user ? form.phone : null,
        payment_method: form.paymentMethod as any,
        payment_status: form.paymentMethod === "cod" ? "cod" : "pending",
        subtotal, shipping_charge: shippingCharge,
        discount_amount: discount, gst_amount: gstAmount, total,
        coupon_id: couponId, shipping_address: shippingAddress,
        gst_number: form.gstNumber || null,
      })
      .select()
      .single();

    if (error || !order) {
      toast.error("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Send WhatsApp confirmation
    const whatsappMsg = `🎉 New Order ${order.order_number}!\n\nItems: ${items.map(i => `${i.product.name} x${i.quantity}`).join(", ")}\nTotal: ₹${total}\n\nShipping to: ${form.fullName}, ${form.address1}, ${form.city} ${form.pincode}`;
    const whatsappUrl = `https://wa.me/919773729154?text=${encodeURIComponent(whatsappMsg)}`;

    clearCart();
    toast.success(`Order placed! 🎉 Order #${order.order_number}`);
    setLoading(false);
    navigate(`/order-success?order=${order.order_number}&wa=${encodeURIComponent(whatsappUrl)}`);
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">🛒</span>
            <h1 className="text-2xl font-extrabold text-foreground mt-4">Cart is Empty</h1>
            <button onClick={() => navigate("/products")} className="mt-4 px-6 py-2 rounded-full gradient-hero text-primary-foreground font-bold text-sm">
              Shop Now
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="container max-w-5xl">
          <h1 className="text-2xl font-extrabold text-foreground mb-6">Checkout</h1>
          <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6">
            {/* Shipping Address */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-foreground mb-4">📍 Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name" className="h-11 px-4 rounded-xl border border-input bg-background text-sm" />
                  <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="h-11 px-4 rounded-xl border border-input bg-background text-sm" />
                  {!user && <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" type="email" className="h-11 px-4 rounded-xl border border-input bg-background text-sm sm:col-span-2" />}
                  <input name="address1" value={form.address1} onChange={handleChange} required placeholder="Address Line 1" className="h-11 px-4 rounded-xl border border-input bg-background text-sm sm:col-span-2" />
                  <input name="address2" value={form.address2} onChange={handleChange} placeholder="Address Line 2 (optional)" className="h-11 px-4 rounded-xl border border-input bg-background text-sm sm:col-span-2" />
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="City" className="h-11 px-4 rounded-xl border border-input bg-background text-sm" />
                  <select name="state" value={form.state} onChange={handleChange} className="h-11 px-4 rounded-xl border border-input bg-background text-sm">
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pincode" pattern="[0-9]{6}" className="h-11 px-4 rounded-xl border border-input bg-background text-sm" />
                  <input name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="GST Number (optional)" className="h-11 px-4 rounded-xl border border-input bg-background text-sm" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-foreground mb-4">💳 Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: "cod", label: "💵 Cash on Delivery", desc: "Pay when delivered" },
                    { value: "upi", label: "📱 UPI (GPay, PhonePe, Paytm)", desc: "Coming soon" },
                    { value: "card", label: "💳 Credit/Debit Card", desc: "Coming soon" },
                    { value: "netbanking", label: "🏦 Net Banking", desc: "Coming soon" },
                  ].map((pm) => (
                    <label key={pm.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === pm.value ? "border-secondary bg-secondary/5" : "border-input"} ${pm.value !== "cod" ? "opacity-50" : ""}`}>
                      <input
                        type="radio" name="paymentMethod" value={pm.value}
                        checked={form.paymentMethod === pm.value}
                        onChange={handleChange}
                        disabled={pm.value !== "cod"}
                        className="accent-secondary"
                      />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{pm.label}</p>
                        <p className="text-xs text-muted-foreground">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">🧾 Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm" />
                  <button type="button" onClick={applyCoupon} className="px-4 h-10 rounded-lg bg-secondary text-secondary-foreground font-bold text-sm">Apply</button>
                </div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span></div>
                  {discount > 0 && <div className="flex justify-between text-secondary"><span>Discount</span><span className="font-semibold">-₹{discount}</span></div>}
                  <div className="flex justify-between text-lg font-extrabold text-foreground border-t border-border pt-2">
                    <span>Total</span><span>₹{total}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 h-12 rounded-xl gradient-hero text-primary-foreground font-bold disabled:opacity-50">
                  {loading ? "Placing Order..." : `Place Order • ₹${total}`}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-2">🔒 Secure checkout</p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
