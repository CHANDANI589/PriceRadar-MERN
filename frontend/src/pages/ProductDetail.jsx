import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PriceRaceBar from "../components/PriceRaceBar";
import PriceHistoryChart from "../components/PriceHistoryChart";
import SmartBuyPredictor from "../components/SmartBuyPredictor";
import SafeImage from "../components/SafeImage";
import { formatINR } from "../utils/platforms";
import { Star, Bell, RefreshCw, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [alertPrice, setAlertPrice] = useState("");

  const load = () => {
    api.get(`/products/${slug}`).then(({ data }) => setProduct(data.product));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [slug]);

  const handleRefreshPrices = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.post(`/products/${slug}/simulate-update`);
      setProduct(data.product);
      toast.success("Prices refreshed across all platforms!");
    } catch {
      toast.error("Could not refresh prices");
    } finally {
      setRefreshing(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    try {
      const { data } = await api.post(`/products/${slug}/reviews`, { rating: reviewRating, comment: reviewText });
      setProduct(data.product);
      setReviewText("");
      toast.success("Review posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    }
  };

  const setPriceAlert = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to set a price alert");
    try {
      await api.post("/users/price-alerts", { productId: product._id, targetPrice: alertPrice });
      toast.success(`We'll notify you when price drops below ${formatINR(alertPrice)}`);
      setAlertPrice("");
    } catch {
      toast.error("Failed to set alert");
    }
  };

  const handleAddToCart = (platformPrice) => addToCart(product, platformPrice.platform, platformPrice.price);

  if (!product) return <div className="text-center py-24 text-slate-400">Loading product...</div>;

  const cheapest = [...product.platformPrices].sort((a, b) => a.price - b.price)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <div>
          <div className="aspect-square bg-white rounded-2xl border border-slate-100 overflow-hidden mb-3">
            <SafeImage src={product.images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? "border-mustard" : "border-slate-100"}`}>
                <SafeImage src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wide">{product.brand}</span>
          <h1 className="font-display font-bold text-2xl text-navy mt-1 mb-2">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-mustard/15 text-mustard-dark px-2 py-0.5 rounded text-sm font-semibold">
              <Star size={13} className="fill-mustard-dark" /> {product.avgRating?.toFixed(1)}
            </div>
            <span className="text-sm text-slate-400">{product.numReviews} reviews</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
            <p className="text-sm text-slate-500 mb-1">Best price right now</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono-price font-extrabold text-3xl text-navy">{formatINR(product.lowestPrice)}</span>
              <span className="text-sm text-mustard-dark font-semibold">on {product.lowestPricePlatform}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Highest listed: <span className="line-through">{formatINR(product.highestPrice)}</span></p>
            <button onClick={() => cheapest.platform === "PriceRadar" ? handleAddToCart(cheapest) : window.open(cheapest.url, "_blank")}
              className="w-full bg-mustard hover:bg-mustard-light text-navy font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ShoppingCart size={18} /> Get it for {formatINR(cheapest.price)} on {cheapest.platform}
            </button>
          </div>

          <div className="mb-5">
            <SmartBuyPredictor slug={slug} />
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-5">
              <h3 className="font-semibold text-navy text-sm mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex gap-1"><span className="text-slate-400">{k}:</span><span className="text-slate-700 font-medium">{v}</span></div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={setPriceAlert} className="bg-navy/5 rounded-xl p-4 flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-navy flex items-center gap-1 mb-1"><Bell size={13} /> Notify me when price drops below</label>
              <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} placeholder={`e.g. ${Math.round(product.lowestPrice * 0.9)}`} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 font-mono-price" />
            </div>
            <button className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-light transition-colors">Set Alert</button>
          </form>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-navy">Compare prices across platforms</h2>
          <button onClick={handleRefreshPrices} disabled={refreshing} className="flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-mustard-light disabled:opacity-50">
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh live prices
          </button>
        </div>
        <PriceRaceBar prices={product.platformPrices} onAddToCart={handleAddToCart} />
      </section>

      <section className="mb-10 bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-display font-bold text-xl text-navy mb-4">30-day price history</h2>
        <PriceHistoryChart history={product.priceHistory} />
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-display font-bold text-xl text-navy mb-4">Customer Reviews ({product.numReviews})</h2>
        <form onSubmit={submitReview} className="mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setReviewRating(n)}>
                <Star size={20} className={n <= reviewRating ? "fill-mustard text-mustard" : "text-slate-200"} />
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience with this product..." className="w-full border border-slate-200 rounded-lg p-3 text-sm mb-2" rows={3} />
          <button className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-light transition-colors">Post Review</button>
        </form>
        <div className="space-y-4">
          {product.reviews?.length === 0 && <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>}
          {[...(product.reviews || [])].reverse().map((r) => (
            <div key={r._id} className="border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-navy">{r.name}</span>
                <div className="flex">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} className={n <= r.rating ? "fill-mustard text-mustard" : "text-slate-200"} />)}</div>
              </div>
              <p className="text-sm text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
