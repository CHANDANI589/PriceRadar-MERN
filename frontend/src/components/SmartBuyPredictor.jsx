import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatINR } from "../utils/platforms";
import { TrendingDown, TrendingUp, Sparkles, Clock } from "lucide-react";

// Unique feature: Smart Buy Predictor. Calls the backend's linear-regression
// trend endpoint and renders a "Buy Now" vs "Wait" recommendation card.
const SmartBuyPredictor = ({ slug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${slug}/predict`)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-4 w-40 bg-slate-100 rounded mb-3" />
        <div className="h-3 w-full bg-slate-100 rounded" />
      </div>
    );
  }
  if (!data) return null;

  const isWait = data.recommendation === "WAIT";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isWait ? "border-coral bg-coral/5" : "border-mustard bg-mustard/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className={isWait ? "text-coral" : "text-mustard-dark"} />
        <h3 className="font-display font-bold text-navy text-sm">Smart Buy Predictor</h3>
        <span className="text-[10px] font-semibold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {data.confidence} confidence
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {isWait ? (
          <TrendingDown size={22} className="text-coral" />
        ) : (
          <TrendingUp size={22} className="text-mustard-dark" />
        )}
        <span className="font-display font-extrabold text-lg text-navy">
          {isWait ? "Wait — price may drop further" : "Buy Now — good time to purchase"}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-3">{data.reason}</p>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock size={12} /> Predicted in 7 days:{" "}
          <span className="font-mono-price font-semibold text-navy">
            {formatINR(data.predictedPrice7d)}
          </span>
        </span>
        <span>
          Trend:{" "}
          <span className={`font-semibold ${data.trendPercent < 0 ? "text-green-600" : "text-coral"}`}>
            {data.trendPercent > 0 ? "+" : ""}
            {data.trendPercent}%
          </span>
        </span>
      </div>
    </div>
  );
};

export default SmartBuyPredictor;
