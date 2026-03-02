import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [ordersRes, productsRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("total, status"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).lt("stock", 5),
      ]);

      const orders = ordersRes.data || [];
      const totalSales = orders.reduce((s, o) => s + Number(o.total), 0);

      setStats({
        totalSales,
        totalOrders: orders.length,
        totalProducts: productsRes.count || 0,
        lowStock: lowStockRes.count || 0,
      });

      const { data: recent } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10);
      setRecentOrders(recent || []);
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Sales", value: `₹${stats.totalSales.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-secondary" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-primary" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-accent" },
    { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-extrabold text-foreground">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h2 className="font-bold text-foreground mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-muted-foreground font-semibold">Order</th>
                <th className="pb-3 text-muted-foreground font-semibold">Status</th>
                <th className="pb-3 text-muted-foreground font-semibold">Payment</th>
                <th className="pb-3 text-muted-foreground font-semibold text-right">Total</th>
                <th className="pb-3 text-muted-foreground font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/50">
                  <td className="py-3 font-bold">{o.order_number}</td>
                  <td className="py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${o.status === "delivered" ? "bg-green-100 text-green-700" : o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{o.payment_method}</td>
                  <td className="py-3 font-bold text-right">₹{o.total}</td>
                  <td className="py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
