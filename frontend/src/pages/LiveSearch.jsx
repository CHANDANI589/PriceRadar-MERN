import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import SafeImage from "../components/SafeImage";
import { formatINR } from "../utils/platforms";
import { Zap, AlertTriangle, Search as SearchIcon } from "lucide-react";

// Real-time product search powered by Google Shopping (via SerpApi on the
// backend) — real products, real photos, real prices from real stores.
const LiveSearch = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError("");
    api
      .get(`/shopping/search?q=${encodeURIComponent(q)}`)
      .then(({ data }) => setResults(data.results || []))
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            "Live search failed. Make sure SERPAPI_KEY is set on the backend."
        )
      )
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setParams({ q: query.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={20} className="text-mustard-dark" />
        <h1 className="font-display font-bold text-2xl text-navy">Live Search</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Real-time results straight from Google Shopping — real products, real photos, real prices.
      </p>

      <form onSubmit={handleSearch} className="flex max-w-lg mb-8">
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any product — e.g. iPhone 15, running shoes..."
            className="w-full rounded-full py-3 pl-5 pr-12 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-mustard"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-mustard hover:bg-mustard-light text-navy p-2 rounded-full transition-colors">
            <SearchIcon size={16} />
          </button>
        </div>
      </form>

      {!q && (
        <p className="text-center text-slate-400 py-16">Type a product name above to search live.</p>
      )}

      {loading && <p className="text-center text-slate-400 py-20">Fetching live listings for "{q}"...</p>}

      {error && (
        <div className="max-w-lg mx-auto text-center py-16 bg-coral/5 border border-coral/20 rounded-xl">
          <AlertTriangle className="text-coral mx-auto mb-3" size={28} />
          <p className="text-coral font-medium text-sm px-4">{error}</p>
        </div>
      )}

      {!loading && !error && q && results.length === 0 && (
        <p className="text-center text-slate-400 py-20">No live results found for "{q}". Try a different search term.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((r) => (
          <Link
            key={r.productId}
            to={`/live-product/${encodeURIComponent(r.productId)}?title=${encodeURIComponent(r.title)}`}
            className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="aspect-square bg-white flex items-center justify-center p-4">
              <SafeImage src={r.image} alt={r.title} className="max-w-full max-h-full w-auto h-auto object-contain" />
            </div>
            <div className="p-3 flex flex-col gap-1 flex-1">
              <span className="text-[11px] text-slate-400 uppercase truncate">{r.source}</span>
              <h3 className="font-medium text-sm text-slate-text line-clamp-2 leading-snug">{r.title}</h3>
              <span className="font-mono-price font-bold text-navy text-lg mt-auto">
                {r.price ? formatINR(r.price) : r.priceDisplay || "—"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LiveSearch;