import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminCustomers = () => {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setProfiles(data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Customers</h1>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/50">
                <th className="p-4 font-semibold text-muted-foreground">Name</th>
                <th className="p-4 font-semibold text-muted-foreground">Phone</th>
                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                <th className="p-4 font-semibold text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="p-4 font-bold text-foreground">{p.full_name || "—"}</td>
                  <td className="p-4 text-muted-foreground">{p.phone || "—"}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {p.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {profiles.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No customers yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
