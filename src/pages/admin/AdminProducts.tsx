import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", original_price: "",
    category_id: "", sku: "", stock: "0", badge: "", is_featured: false, is_active: true,
    weight_grams: "", meta_title: "", meta_description: "",
  });

  const loadData = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", price: "", original_price: "", category_id: "", sku: "", stock: "0", badge: "", is_featured: false, is_active: true, weight_grams: "", meta_title: "", meta_description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : "",
      category_id: p.category_id || "", sku: p.sku || "", stock: String(p.stock),
      badge: p.badge || "", is_featured: p.is_featured, is_active: p.is_active,
      weight_grams: p.weight_grams ? String(p.weight_grams) : "",
      meta_title: p.meta_title || "", meta_description: p.meta_description || "",
    });
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = async () => {
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = {
      name: form.name, slug, description: form.description,
      price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null,
      category_id: form.category_id || null, sku: form.sku || null,
      stock: Number(form.stock), badge: form.badge || null,
      is_featured: form.is_featured, is_active: form.is_active,
      weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
      meta_title: form.meta_title || null, meta_description: form.meta_description || null,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product created!");
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    loadData();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
          <h2 className="font-bold text-foreground mb-4">{editing ? "Edit Product" : "New Product"}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name *" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (auto-generated)" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price *" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="Original Price" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Badge (e.g., Bestseller)" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <input value={form.weight_grams} onChange={(e) => setForm({ ...form, weight_grams: e.target.value })} placeholder="Weight (grams)" type="number" className="h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="sm:col-span-2 lg:col-span-3 px-3 py-2 rounded-lg border border-input bg-background text-sm min-h-[80px]" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-6 py-2 rounded-xl gradient-hero text-primary-foreground font-bold text-sm">
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={resetForm} className="px-6 py-2 rounded-xl border border-border text-foreground font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/50">
                <th className="p-4 font-semibold text-muted-foreground">Product</th>
                <th className="p-4 font-semibold text-muted-foreground">Category</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Price</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Stock</th>
                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                <th className="p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="font-bold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sku || "—"}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.categories?.name || "—"}</td>
                  <td className="p-4 text-right font-bold">₹{p.price}</td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${p.stock < 5 ? "text-destructive" : "text-foreground"}`}>{p.stock}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No products yet. Add your first product!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
