import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/wishlist")
      .then(({ data }) => { setItems(data.wishlist); setLoading(false); })
      .catch((err) => {
        if (err.response?.status === 401) {
          setLoading(false);
          return;
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-24 text-slate-400">Loading wishlist...</p>;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Heart size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl text-navy mb-2">Your wishlist is empty</h2>
        <p className="text-slate-500 mb-6">Tap the heart icon on any product to save it here.</p>
        <Link to="/search" className="bg-navy text-white px-6 py-2.5 rounded-full font-semibold hover:bg-navy-light transition-colors">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default Wishlist;
