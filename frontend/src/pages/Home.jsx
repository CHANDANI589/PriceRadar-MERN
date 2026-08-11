import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, TrendingDown, Bell, ShieldCheck, Zap } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import PriceRaceBar from "../components/PriceRaceBar";
import PlatformMarquee from "../components/PlatformMarquee";
import SafeImage from "../components/SafeImage";

const CATEGORY_ICONS = {
  Mobiles: "📱", Laptops: "💻", Fashion: "👕", "Home & Kitchen": "🍳",
  Electronics: "🎧", Beauty: "💄", Footwear: "👟", Accessories: "🎒",
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroProduct, setHeroProduct] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products?limit=8&sort=rating").then(({ data }) => {
      setProducts(data.products);
      if (data.products[0]) setHeroProduct(data.products[0]);
    });
    api.get("/products/categories/list").then(({ data }) => setCategories(data.categories));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/live-search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 text-mustard text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Zap size={13} /> Live real-time search powered by Google Shopping
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
              One search. <span className="text-mustard">Every price.</span> Best deal.
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
              Search any real product and instantly compare real prices from real stores — or
              browse our demo catalog with full checkout, alerts, and savings tracking.
            </p>
            <form onSubmit={handleSearch} className="flex max-w-md">
              <div className="relative w-full">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try 'iPhone 15' or 'running shoes'"
                  className="w-full rounded-full py-3.5 pl-5 pr-14 text-sm text-slate-text focus:outline-none focus:ring-4 focus:ring-mustard/40" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-mustard hover:bg-mustard-light text-navy p-2.5 rounded-full transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <div className="flex gap-6 mt-8 text-white/80 text-sm">
              <div className="flex items-center gap-2"><TrendingDown size={16} className="text-mustard"/> Avg. 18% savings</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-mustard"/> Verified prices</div>
            </div>
          </div>

          {heroProduct && (
            <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-2xl animate-fadeUp">
              <div className="flex items-center gap-3 mb-3">
                <SafeImage src={heroProduct.images?.[0]} className="w-14 h-14 rounded-lg object-cover" alt="" />
                <div>
                  <p className="text-xs text-slate-400">Trending in our catalog</p>
                  <p className="font-semibold text-sm text-slate-text line-clamp-1">{heroProduct.title}</p>
                </div>
              </div>
              <PriceRaceBar prices={heroProduct.platformPrices?.slice(0, 3)} />
              <Link to={`/product/${heroProduct.slug}`} className="block text-center mt-3 text-sm font-semibold text-navy hover:text-mustard-light">
                See full comparison →
              </Link>
            </div>
          )}
        </div>
      </section>

      <PlatformMarquee />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl text-navy mb-6">Browse our catalog by category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              className="flex flex-col items-center gap-2 bg-white border border-slate-100 rounded-xl p-4 hover:border-mustard hover:shadow-card transition-all">
              <span className="text-2xl">{CATEGORY_ICONS[cat] || "🛍️"}</span>
              <span className="text-xs font-medium text-slate-600 text-center">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-navy">Top-rated catalog deals</h2>
          <Link to="/search" className="text-sm font-semibold text-navy hover:text-mustard-light">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className="bg-white border-t border-slate-100 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="bg-mustard/15 p-3 rounded-xl h-fit"><Zap className="text-mustard-dark" /></div>
            <div>
              <h3 className="font-display font-bold text-navy mb-1">Live Search</h3>
              <p className="text-sm text-slate-500">Search any real product and get real-time results with real photos and real prices.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-coral/15 p-3 rounded-xl h-fit"><Bell className="text-coral" /></div>
            <div>
              <h3 className="font-display font-bold text-navy mb-1">Smart Buy Predictor</h3>
              <p className="text-sm text-slate-500">A trend algorithm analyzes price history and tells you whether to buy now or wait.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-navy/10 p-3 rounded-xl h-fit"><ShieldCheck className="text-navy" /></div>
            <div>
              <h3 className="font-display font-bold text-navy mb-1">Savings Tracker</h3>
              <p className="text-sm text-slate-500">Earn badges and track how much money you've saved shopping smarter.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
