import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, Zap } from "lucide-react";

const CATEGORIES = ["Mobiles", "Laptops", "Fashion", "Home & Kitchen", "Electronics", "Beauty", "Footwear", "Accessories"];

const SearchResults = () => {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");

  const q = params.get("q") || "";

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (q) query.set("search", q);
    if (category) query.set("category", category);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (sort) query.set("sort", sort);
    query.set("limit", 24);

    api.get(`/products?${query.toString()}`).then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  }, [q, category, maxPrice, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <h1 className="font-display font-bold text-2xl text-navy">
          {q ? `Catalog results for "${q}"` : "Browse our catalog"}
        </h1>
        {q && (
          <Link to={`/live-search?q=${encodeURIComponent(q)}`} className="flex items-center gap-1.5 text-sm font-semibold text-navy bg-mustard/20 hover:bg-mustard/30 px-3 py-1.5 rounded-full transition-colors">
            <Zap size={14} /> Try Live Search instead
          </Link>
        )}
      </div>
      <p className="text-slate-500 text-sm mb-6">{products.length} products found in our demo catalog</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-xl border border-slate-100 p-4 h-fit sticky top-20">
          <h3 className="flex items-center gap-2 font-semibold text-sm text-navy mb-4">
            <SlidersHorizontal size={15} /> Filters
          </h3>
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Category</p>
            <div className="space-y-1.5">
              <button onClick={() => setCategory("")} className={`block text-sm w-full text-left px-2 py-1 rounded ${!category ? "text-mustard-dark font-semibold" : "text-slate-600"}`}>All Categories</button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`block text-sm w-full text-left px-2 py-1 rounded ${category === c ? "text-mustard-dark font-semibold" : "text-slate-600"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Budget (Low Price Mode)</p>
            <div className="space-y-1.5">
              {[500, 1000, 2000, 5000, 20000, 60000].map((v) => (
                <button key={v} onClick={() => setMaxPrice(v)} className={`block text-sm w-full text-left px-2 py-1 rounded ${Number(maxPrice) === v ? "text-mustard-dark font-semibold" : "text-slate-600"}`}>Under ₹{v.toLocaleString("en-IN")}</button>
              ))}
              <button onClick={() => setMaxPrice("")} className="text-xs text-coral mt-1">Clear</button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Sort by</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5">
              <option value="">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <div>
          {loading ? (
            <p className="text-slate-400 py-20 text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 mb-3">No products match your filters in our catalog.</p>
              {q && (
                <Link to={`/live-search?q=${encodeURIComponent(q)}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy bg-mustard px-4 py-2 rounded-full hover:bg-mustard-light transition-colors">
                  <Zap size={14} /> Search "{q}" live instead
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
