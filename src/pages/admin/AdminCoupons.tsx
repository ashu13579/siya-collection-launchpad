import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", description: "", discount_type: "percentage", discount_value: "",
    min_order_amount: "", max_discount: "", usage_limit: "", expires_at: "",
  });

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    const { error } = await supabase.from("coupons").insert({
      code: form.code.toUpperCase(),
      description: form.description || null,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
      max_discount: form.max_discount ? Number(form.max_discount) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      expires_at: form.expires_at || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Coupon created!");
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    toast.success("Coupon deleted");
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Coupon Code *" className="h-10 px-3 rounded-lg border border-input bg-background text-sm uppercase" />
            <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="Discount Value *" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} placeholder="Min Order Amount" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: e.target.value })} placeholder="Max Discount" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} placeholder="Usage Limit" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} type="datetime-local" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="h-10 px-3 rounded-lg border border-input bg-background text-sm sm:col-span-2" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate} className="px-6 py-2 rounded-xl gradient-hero text-primary-foreground font-bold text-sm">Create</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl border border-border text-foreground font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/50">
                <th className="p-4 font-semibold text-muted-foreground">Code</th>
                <th className="p-4 font-semibold text-muted-foreground">Discount</th>
                <th className="p-4 font-semibold text-muted-foreground">Used</th>
                <th className="p-4 font-semibold text-muted-foreground">Expires</th>
                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="p-4 font-bold text-foreground">{c.code}</td>
                  <td className="p-4">{c.discount_value}{c.discount_type === "percentage" ? "%" : "₹"}</td>
                  <td className="p-4">{c.used_count}/{c.usage_limit || "∞"}</td>
                  <td className="p-4 text-muted-foreground">{c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "Never"}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4"><button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No coupons yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
