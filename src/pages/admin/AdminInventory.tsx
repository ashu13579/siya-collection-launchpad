import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

const AdminInventory = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("products").select("id, name, sku, stock, low_stock_threshold, is_active").order("stock", { ascending: true }).then(({ data }) => setProducts(data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Inventory</h1>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/50">
                <th className="p-4 font-semibold text-muted-foreground">Product</th>
                <th className="p-4 font-semibold text-muted-foreground">SKU</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Stock</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Threshold</th>
                <th className="p-4 font-semibold text-muted-foreground">Alert</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="p-4 font-bold text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.sku || "—"}</td>
                  <td className={`p-4 text-right font-bold ${p.stock <= p.low_stock_threshold ? "text-destructive" : "text-foreground"}`}>{p.stock}</td>
                  <td className="p-4 text-right text-muted-foreground">{p.low_stock_threshold}</td>
                  <td className="p-4">
                    {p.stock <= p.low_stock_threshold && (
                      <span className="flex items-center gap-1 text-xs font-bold text-destructive">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No products in inventory</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
