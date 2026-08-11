import { PLATFORM_STYLES } from "../utils/platforms";
import { Radar } from "lucide-react";

const platforms = Object.entries(PLATFORM_STYLES);
const track = [...platforms, ...platforms, ...platforms];

const PlatformMarquee = () => (
  <section className="bg-white border-y border-slate-100 py-10 overflow-hidden">
    <p className="text-center text-sm text-slate-400 mb-6">
      Compare prices across India's most popular online stores
    </p>
    <div className="relative">
      <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
        {track.map(([key, style], i) => (
          <span
            key={key + i}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-sm shrink-0 shadow-sm"
            style={{ backgroundColor: style.color, color: style.text }}
          >
            {key === "PriceRadar" && <Radar size={15} />}
            {style.label}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
    </div>
  </section>
);

export default PlatformMarquee;
