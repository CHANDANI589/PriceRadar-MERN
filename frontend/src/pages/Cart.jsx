import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatINR, PLATFORM_STYLES } from "../utils/platforms";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import SafeImage from "../components/SafeImage";

const Cart = () => {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl text-navy mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Find the best deal and add it to your cart.</p>
        <Link to="/search" className="bg-navy text-white px-6 py-2.5 rounded-full font-semibold hover:bg-navy-light transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 999 ? 0 : 49;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Your Cart ({cart.length})</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.productId + item.platform} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4">
              <SafeImage src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <Link to={`/product/${item.slug}`} className="font-medium text-sm text-slate-text line-clamp-1 hover:text-navy">
                  {item.title}
                </Link>
                <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1"
                  style={{ backgroundColor: PLATFORM_STYLES[item.platform]?.color, color: PLATFORM_STYLES[item.platform]?.text }}>
                  {item.platform}
                </span>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 border border-slate-200 rounded-full px-2 py-1">
                    <button onClick={() => updateQty(item.productId, item.platform, item.qty - 1)}><Minus size={13} /></button>
                    <span className="text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.platform, item.qty + 1)}><Plus size={13} /></button>
                  </div>
                  <span className="font-mono-price font-bold text-navy">{formatINR(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.productId, item.platform)} className="text-slate-300 hover:text-coral self-start">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5 h-fit">
          <h3 className="font-display font-semibold text-navy mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2 text-slate-600">
            <span>Subtotal</span><span className="font-mono-price">{formatINR(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3 text-slate-600">
            <span>Shipping</span><span className="font-mono-price">{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-navy border-t border-slate-100 pt-3 mb-4">
            <span>Total</span><span className="font-mono-price">{formatINR(totalPrice + shipping)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="w-full bg-mustard hover:bg-mustard-light text-navy font-bold py-3 rounded-xl transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
