import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import SafeImage from "../components/SafeImage";
import { formatINR } from "../utils/platforms";
import { Zap, AlertTriangle, Search as SearchIcon } from "lucide-react";

// Real-time product search powered by Google Shopping via SerpApi.
const LiveSearch = () => {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch live products whenever search query changes
  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/shopping/search?q=${encodeURIComponent(q)}`)
      .then(({ data }) => {
        setResults(Array.isArray(data.results) ? data.results : []);
      })
      .catch((err) => {
        console.error("Live search error:", err);

        setError(
          err.response?.data?.message ||
            "Live search failed. Make sure SERPAPI_KEY is set on the backend."
        );

        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [q]);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();

    const value = query.trim();

    if (!value) return;

    setParams({ q: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex items-center gap-2 mb-1">
        <Zap size={20} className="text-mustard-dark" />

        <h1 className="font-display font-bold text-2xl text-navy">
          Live Search
        </h1>
      </div>

      <p className="text-slate-500 text-sm mb-6">
        Real-time results straight from Google Shopping — real products, real
        photos, real prices.
      </p>

      {/* =========================
          SEARCH BOX
      ========================== */}
      <form onSubmit={handleSearch} className="flex max-w-2xl mb-8">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any product — e.g. iPhone 15, saree, running shoes..."
            className="
              w-full
              rounded-full
              py-3
              pl-5
              pr-14
              text-sm
              border
              border-slate-200
              bg-white
              text-slate-text
              focus:outline-none
              focus:ring-2
              focus:ring-mustard
            "
          />

          <button
            type="submit"
            disabled={!query.trim()}
            className="
              absolute
              right-1.5
              top-1/2
              -translate-y-1/2
              bg-mustard
              hover:bg-mustard-light
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-navy
              p-2
              rounded-full
              transition-colors
            "
          >
            <SearchIcon size={16} />
          </button>
        </div>
      </form>

      {/* =========================
          NO QUERY
      ========================== */}
      {!q && !loading && (
        <div className="text-center py-16">
          <SearchIcon
            size={38}
            className="mx-auto mb-4 text-slate-300"
          />

          <p className="text-slate-400">
            Type a product name above to search live.
          </p>
        </div>
      )}

      {/* =========================
          LOADING
      ========================== */}
      {loading && (
        <div className="text-center py-20">
          <div
            className="
              inline-block
              w-8
              h-8
              border-4
              border-slate-200
              border-t-mustard
              rounded-full
              animate-spin
              mb-4
            "
          />

          <p className="text-slate-400">
            Fetching live listings for "{q}"...
          </p>
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}
      {error && !loading && (
        <div
          className="
            max-w-lg
            mx-auto
            text-center
            py-12
            bg-coral/5
            border
            border-coral/20
            rounded-xl
          "
        >
          <AlertTriangle
            className="text-coral mx-auto mb-3"
            size={30}
          />

          <p className="text-coral font-medium text-sm px-4">
            {error}
          </p>
        </div>
      )}

      {/* =========================
          NO RESULTS
      ========================== */}
      {!loading && !error && q && results.length === 0 && (
        <div className="text-center py-20">
          <SearchIcon
            size={36}
            className="mx-auto mb-4 text-slate-300"
          />

          <p className="text-slate-400">
            No live results found for "{q}".
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Try a different product name.
          </p>
        </div>
      )}

      {/* =========================
          PRODUCT RESULTS
      ========================== */}
      {!loading && !error && results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-navy">
                Live results
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                {results.length} products found for "{q}"
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-4
            "
          >
            {results.map((r, index) => {
              const productId =
                r.productId || `result-${index}`;

              const title =
                r.title || "Product";

              const price =
                r.price !== null &&
                r.price !== undefined &&
                r.price !== ""
                  ? formatINR(r.price)
                  : r.priceDisplay || "Price unavailable";

              return (
                <Link
                  key={productId}
                  to={`/live-product/${encodeURIComponent(
                    productId
                  )}?title=${encodeURIComponent(title)}`}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    border
                    border-slate-100
                    shadow-card
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    overflow-hidden
                    flex
                    flex-col
                  "
                >
                  {/* =========================
                      PRODUCT IMAGE
                  ========================== */}
                  <div
                    className="
                      relative
                      aspect-square
                      bg-white
                      flex
                      items-center
                      justify-center
                      p-4
                      overflow-hidden
                    "
                  >
                    <SafeImage
                      src={r.image}
                      alt={title}
                      className="
                        w-full
                        h-full
                        object-contain
                        group-hover:scale-105
                        transition-transform
                        duration-500
                      "
                    />
                  </div>

                  {/* =========================
                      PRODUCT CONTENT
                  ========================== */}
                  <div
                    className="
                      p-3
                      flex
                      flex-col
                      flex-1
                      min-w-0
                    "
                  >
                    {/* Store / Source */}
                    <span
                      className="
                        text-[11px]
                        text-slate-400
                        uppercase
                        tracking-wide
                        truncate
                        mb-1
                      "
                      title={r.source || ""}
                    >
                      {r.source || "Online Store"}
                    </span>

                    {/* Product title */}
                    <h3
                      className="
                        font-medium
                        text-sm
                        text-slate-text
                        leading-snug
                        line-clamp-2
                        min-h-[40px]
                      "
                      title={title}
                    >
                      {title}
                    </h3>

                    {/* Rating */}
                    {(r.rating || r.reviews) && (
                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >
                        {r.rating && (
                          <>
                            <span className="text-mustard">
                              ★
                            </span>

                            <span>
                              {Number(r.rating).toFixed(1)}
                            </span>
                          </>
                        )}

                        {r.reviews && (
                          <span>
                            ({r.reviews})
                          </span>
                        )}
                      </div>
                    )}

                    {/* =========================
                        PRICE
                    ========================== */}
                    <div className="mt-2">
                      <span
                        className="
                          font-mono-price
                          font-bold
                          text-navy
                          text-lg
                          leading-none
                        "
                      >
                        {price}
                      </span>
                    </div>

                    {/* View product */}
                    <div
                      className="
                        text-[11px]
                        text-mustard-dark
                        font-semibold
                        mt-2
                      "
                    >
                      View product →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LiveSearch;