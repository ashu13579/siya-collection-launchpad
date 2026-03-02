import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const loadOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setOrders(data || []);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", orderId);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order updated to ${status}`);
    loadOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Orders</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["all", ...statusOptions].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${filter === s ? "gradient-hero text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const addr = order.shipping_address as any;
          return (
            <div key={order.id} className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-bold text-foreground text-lg">{order.order_number}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-semibold">
                    {statusOptions.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-semibold text-foreground">{addr?.full_name || order.guest_email || "—"}</p>
                  <p className="text-xs text-muted-foreground">{addr?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Shipping</p>
                  <p className="text-foreground">{addr?.address_line1}, {addr?.city}</p>
                  <p className="text-foreground">{addr?.state} - {addr?.pincode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-extrabold text-foreground">₹{order.total}</p>
                  <p className="text-xs text-muted-foreground">{order.payment_method?.toUpperCase()} • {order.payment_status}</p>
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl text-muted-foreground">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
