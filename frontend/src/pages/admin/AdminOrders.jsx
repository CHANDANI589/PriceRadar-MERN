import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatINR } from "../../utils/platforms";
import toast from "react-hot-toast";

const STATUSES = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders").then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success("Order status updated"); load(); }
    catch { toast.error("Failed to update status"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Manage Orders</h1>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr><th className="text-left px-4 py-3">Order ID</th><th className="text-left px-4 py-3">Customer</th><th className="text-left px-4 py-3">Total</th><th className="text-left px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-slate-50">
                <td className="px-4 py-3">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3">{o.user?.name}<br /><span className="text-slate-400 text-xs">{o.user?.email}</span></td>
                <td className="px-4 py-3 font-mono-price font-semibold text-navy">{formatINR(o.totalPrice)}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1 text-xs">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
