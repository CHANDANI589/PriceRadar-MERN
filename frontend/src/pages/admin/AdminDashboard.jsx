import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, IndianRupee } from "lucide-react";
import { formatINR } from "../../utils/platforms";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([api.get("/products?limit=1"), api.get("/orders")]).then(([p, o]) => {
      const revenue = o.data.orders.reduce((sum, ord) => sum + ord.totalPrice, 0);
      setStats({ products: p.data.total, orders: o.data.orders.length, revenue });
    });
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "bg-navy" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "bg-mustard-dark" },
    { label: "Total Revenue", value: formatINR(stats.revenue), icon: IndianRupee, color: "bg-coral" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
            <div className={`${c.color} text-white p-3 rounded-xl`}><c.icon size={22} /></div>
            <div><p className="text-xs text-slate-400">{c.label}</p><p className="font-display font-bold text-xl text-navy">{c.value}</p></div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/products" className="bg-white rounded-xl border border-slate-100 p-6 hover:border-mustard transition-colors">
          <Package className="text-navy mb-2" />
          <h3 className="font-display font-semibold text-navy">Manage Products</h3>
          <p className="text-sm text-slate-500">Add, edit, or remove products and their multi-platform prices.</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl border border-slate-100 p-6 hover:border-mustard transition-colors">
          <ShoppingBag className="text-navy mb-2" />
          <h3 className="font-display font-semibold text-navy">Manage Orders</h3>
          <p className="text-sm text-slate-500">View all customer orders and update delivery status.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
