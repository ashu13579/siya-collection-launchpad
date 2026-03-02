import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order");
  const waUrl = params.get("wa");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-3xl font-extrabold text-foreground">Order Placed!</h1>
          <p className="text-muted-foreground mt-2">
            Your order <span className="font-bold text-secondary">{orderNumber}</span> has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-1">You'll receive a confirmation email shortly.</p>

          <div className="flex flex-col gap-3 mt-8">
            {waUrl && (
              <a href={decodeURIComponent(waUrl)} target="_blank" rel="noopener noreferrer" className="h-11 px-6 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2">
                📱 Confirm on WhatsApp
              </a>
            )}
            <Link to="/account/orders" className="h-11 px-6 rounded-xl gradient-hero text-primary-foreground font-bold text-sm flex items-center justify-center">
              Track Your Order
            </Link>
            <Link to="/products" className="h-11 px-6 rounded-xl border border-border text-foreground font-bold text-sm flex items-center justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderSuccess;
