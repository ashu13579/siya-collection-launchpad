import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Package, Heart, MapPin, RotateCcw, LogOut, User } from "lucide-react";

const Account = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    supabase.from("addresses").select("*").eq("user_id", user.id).then(({ data }) => setAddresses(data || []));
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  if (loading || !user) return null;

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-foreground">My Account</h1>
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-semibold text-destructive hover:underline">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${tab === t.id ? "gradient-hero text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
                  <p className="mt-3 font-semibold text-muted-foreground">No orders yet</p>
                  <Link to="/products" className="inline-block mt-3 px-5 py-2 rounded-full gradient-hero text-primary-foreground font-bold text-sm">Shop Now</Link>
                </div>
              ) : orders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-foreground">{order.order_number}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{new Date(order.created_at).toLocaleDateString("en-IN")}</span>
                    <span className="font-bold text-foreground">₹{order.total}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Payment: {order.payment_method?.toUpperCase()} • {order.payment_status?.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Addresses */}
          {tab === "addresses" && (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
                  <p className="mt-3 font-semibold text-muted-foreground">No saved addresses</p>
                </div>
              ) : addresses.map((addr) => (
                <div key={addr.id} className="bg-card rounded-2xl p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{addr.label}</span>
                    {addr.is_default && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Default</span>}
                  </div>
                  <p className="font-semibold text-foreground">{addr.full_name}</p>
                  <p className="text-sm text-muted-foreground">{addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {/* Profile */}
          {tab === "profile" && profile && (
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="space-y-3">
                <div><label className="text-xs text-muted-foreground">Name</label><p className="font-semibold text-foreground">{profile.full_name || "—"}</p></div>
                <div><label className="text-xs text-muted-foreground">Email</label><p className="font-semibold text-foreground">{user.email}</p></div>
                <div><label className="text-xs text-muted-foreground">Phone</label><p className="font-semibold text-foreground">{profile.phone || "—"}</p></div>
                <div><label className="text-xs text-muted-foreground">Member Since</label><p className="font-semibold text-foreground">{new Date(profile.created_at).toLocaleDateString("en-IN")}</p></div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Account;
