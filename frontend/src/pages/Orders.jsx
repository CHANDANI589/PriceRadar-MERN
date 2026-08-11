import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatINR } from "../utils/platforms";
import { Package } from "lucide-react";
import SafeImage from "../components/SafeImage";

const STATUS_COLORS = {
  Placed: "bg-slate-100 text-slate-600",
  Confirmed: "bg-blue-100 text-blue-600",
  Shipped: "bg-mustard/20 text-mustard-dark",
  "Out for Delivery": "bg-orange-100 text-orange-600",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => { setOrders(data.orders); setLoading(false); });
  }, []);

  if (loading) return <p className="text-center py-24 text-slate-400">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Package size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl text-navy mb-2">No orders yet</h2>
        <p className="text-slate-500">Your placed orders will show up here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-slate-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
            </div>
            <div className="space-y-2 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <SafeImage src={item.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                  </div>
                  <span className="font-mono-price text-sm text-navy">{formatINR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            {order.savedAmount > 0 && (
              <p className="text-xs text-green-600 font-semibold mb-2">You saved {formatINR(order.savedAmount)} on this order 🎉</p>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-3">
              <span className="text-sm text-slate-500">Total</span>
              <span className="font-mono-price font-bold text-navy">{formatINR(order.totalPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
