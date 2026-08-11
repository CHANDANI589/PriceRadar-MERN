import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { formatINR } from "../utils/platforms";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import SafeImage from "./SafeImage";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const [wished, setWished] = useState(false);
  const discount =
    product.highestPrice > product.lowestPrice
      ? Math.round(((product.highestPrice - product.lowestPrice) / product.highestPrice) * 100)
      : 0;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save items");
    try {
      await api.post(`/users/wishlist/${product._id}`);
      setWished((w) => !w);
      toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <SafeImage
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1.5 rounded-full shadow hover:scale-110 transition-transform"
        >
          <Heart size={16} className={wished ? "fill-coral text-coral" : "text-slate-400"} />
        </button>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-coral text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            Save {discount}%
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] text-slate-400 uppercase tracking-wide">{product.brand}</span>
        <h3 className="font-medium text-sm text-slate-text line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Star size={12} className="fill-mustard text-mustard" />
          {product.avgRating?.toFixed(1)} ({product.numReviews})
        </div>
        <div className="mt-auto pt-1 flex items-baseline gap-2">
          <span className="font-mono-price font-bold text-navy text-lg">
            {formatINR(product.lowestPrice)}
          </span>
          {product.highestPrice > product.lowestPrice && (
            <span className="text-xs text-slate-400 line-through font-mono-price">
              {formatINR(product.highestPrice)}
            </span>
          )}
        </div>
        <span className="text-[11px] text-mustard-dark font-semibold">
          Lowest on {product.lowestPricePlatform}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
