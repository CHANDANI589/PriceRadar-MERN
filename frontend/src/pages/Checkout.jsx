import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { formatINR } from "../utils/platforms";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ line1: "", line2: "", city: "", state: "", pincode: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const shipping = totalPrice > 999 ? 0 : 49;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const items = cart.map((i) => ({ product: i.productId, title: i.title, image: i.image, price: i.price, qty: i.qty }));
      const { data } = await api.post("/orders", { items, shippingAddress: form, paymentMethod });
      clearCart();
      toast.success(
        data.order.savedAmount > 0
          ? `Order placed! You saved ₹${data.order.savedAmount} on this order 🎉`
          : "Order placed successfully!"
      );
      navigate(`/orders`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) return <p className="text-center py-24 text-slate-400">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Checkout</h1>
      <form onSubmit={placeOrder} className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <h3 className="font-display font-semibold text-navy mb-2">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="line1" required placeholder="Address line 1" value={form.line1} onChange={handleChange} className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            <input name="line2" placeholder="Address line 2 (optional)" value={form.line2} onChange={handleChange} className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            <input name="city" required placeholder="City" value={form.city} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            <input name="state" required placeholder="State" value={form.state} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            <input name="pincode" required placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            <input name="phone" required placeholder="Phone number" value={form.phone} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <h3 className="font-display font-semibold text-navy mt-4 mb-2">Payment Method</h3>
          <div className="space-y-2">
            {["COD", "UPI", "Card"].map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2 cursor-pointer">
                <input type="radio" name="paymentMethod" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                {m === "COD" ? "Cash on Delivery" : m}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5 h-fit">
          <h3 className="font-display font-semibold text-navy mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.productId + item.platform} className="flex justify-between text-sm mb-2 text-slate-600">
              <span className="line-clamp-1 max-w-[65%]">{item.title} × {item.qty}</span>
              <span className="font-mono-price">{formatINR(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm mb-2 text-slate-600 border-t border-slate-100 pt-2 mt-2">
            <span>Shipping</span><span className="font-mono-price">{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-navy pt-2 mb-4">
            <span>Total</span><span className="font-mono-price">{formatINR(totalPrice + shipping)}</span>
          </div>
          <button disabled={placing} className="w-full bg-mustard hover:bg-mustard-light text-navy font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            <CheckCircle2 size={18} /> {placing ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
