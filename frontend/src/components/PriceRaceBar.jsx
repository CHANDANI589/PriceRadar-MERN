import { useEffect, useState } from "react";
import { PLATFORM_STYLES, formatINR } from "../utils/platforms";
import { ExternalLink, ShoppingCart, Trophy } from "lucide-react";

const PriceRaceBar = ({ prices = [], onBuy, onAddToCart }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, [prices]);

  if (!prices.length) return null;

  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const minPrice = sorted[0].price;
  const maxPrice = sorted[sorted.length - 1].price;
  const range = Math.max(maxPrice - minPrice, 1);

  return (
    <div className="space-y-3">
      {sorted.map((p, idx) => {
        const style = PLATFORM_STYLES[p.platform] || PLATFORM_STYLES.PriceRadar;
        const isCheapest = idx === 0;
        const widthPct = 25 + ((p.price - minPrice) / range) * 65;

        return (
          <div
            key={p.platform}
            className={`relative rounded-xl border p-3 transition-all ${
              isCheapest
                ? "border-mustard bg-mustard/10 shadow-glow animate-pulseGlow"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md font-display"
                  style={{ backgroundColor: style.color, color: style.text }}
                >
                  {style.label}
                </span>
                {isCheapest && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-navy">
                    <Trophy size={13} className="text-mustard" /> Best Price
                  </span>
                )}
                {!p.inStock && (
                  <span className="text-xs text-coral font-medium">Out of stock</span>
                )}
              </div>
              <div className="text-right">
                <span className="font-mono-price font-bold text-navy text-base">
                  {formatINR(p.price)}
                </span>
                {p.originalPrice > p.price && (
                  <span className="ml-2 text-xs text-slate-400 line-through font-mono-price">
                    {formatINR(p.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${widthPct}%` : "0%",
                  backgroundColor: isCheapest ? "#F2B705" : style.color,
                }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>
                ⭐ {p.rating?.toFixed?.(1) ?? p.rating} · Delivery in {p.deliveryDays} day
                {p.deliveryDays > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                {p.platform === "PriceRadar" ? (
                  <button
                    onClick={() => onAddToCart?.(p)}
                    disabled={!p.inStock}
                    className="flex items-center gap-1 text-navy font-semibold hover:text-mustard disabled:opacity-40 transition-colors"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                ) : (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onBuy?.(p)}
                    className="flex items-center gap-1 text-navy font-semibold hover:text-mustard transition-colors"
                  >
                    Visit {style.label} <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceRaceBar;
