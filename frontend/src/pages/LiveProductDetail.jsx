import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import SafeImage from "../components/SafeImage";
import { formatINR } from "../utils/platforms";
import { ExternalLink, Trophy, ArrowLeft, AlertTriangle } from "lucide-react";

// Real multi-seller price comparison for one specific product, powered by
// SerpApi's Google Product engine — the genuine "compare across real stores"
// experience for products found via Live Search.
const LiveProductDetail = () => {
  const { productId } = useParams();
  const [params] = useSearchParams();
  const title = params.get("title") || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/shopping/offers?product_id=${encodeURIComponent(productId)}&title=${encodeURIComponent(title)}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load live offers"))
      .finally(() => setLoading(false));
  }, [productId, title]);

  if (loading) return <p className="text-center py-24 text-slate-400">Loading live offers...</p>;

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <AlertTriangle className="text-coral mx-auto mb-3" size={28} />
        <p className="text-coral font-medium text-sm">{error}</p>
        <Link to="/live-search" className="inline-flex items-center gap-1 text-sm font-semibold text-navy mt-4 hover:text-mustard-dark">
          <ArrowLeft size={14} /> Back to search
        </Link>
      </div>
    );
  }

  const offers = data?.offers || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/live-search" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy mb-4">
        <ArrowLeft size={14} /> Back to live search
      </Link>

      <div className="flex gap-5 mb-6">
        {data?.images?.[0] && (
          <SafeImage src={data.images[0]} className="w-32 h-32 object-cover rounded-xl border border-slate-100" alt="" />
        )}
        <div>
          <h1 className="font-display font-bold text-xl text-navy mb-1">{data?.title || title}</h1>
          <p className="text-sm text-slate-500">{offers.length} live sellers found for this exact product</p>
        </div>
      </div>

      <h2 className="font-display font-semibold text-lg text-navy mb-3">Compare live prices</h2>
      <div className="space-y-3">
        {offers.map((o, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              i === 0 ? "border-mustard bg-mustard/10 shadow-glow" : "border-slate-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-navy">{o.source}</span>
              {i === 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-mustard-dark">
                  <Trophy size={13} /> Best Price
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono-price font-bold text-navy">
                {o.price ? formatINR(o.price) : o.priceDisplay || "—"}
              </span>
              <a
                href={o.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-mustard-dark"
              >
                Visit Store <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <p className="text-slate-400 text-sm">No seller offers found for this product right now.</p>
        )}
      </div>
    </div>
  );
};

export default LiveProductDetail;
