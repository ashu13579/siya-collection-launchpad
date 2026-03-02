import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Boxes, Settings, LogOut, ChevronLeft } from "lucide-react";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-card border-r border-border flex flex-col transition-all duration-200 shrink-0`}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          {sidebarOpen && <span className="font-extrabold text-foreground text-sm">🧸 Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-muted">
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {adminNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${active ? "gradient-hero text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">
            <ChevronLeft className="w-4 h-4" /> {sidebarOpen && "Back to Store"}
          </Link>
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full">
            <LogOut className="w-4 h-4" /> {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
