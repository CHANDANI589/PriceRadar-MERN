import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { formatINR } from "../utils/platforms";
import { Bell, Trophy, Medal, Award, ShoppingBag, Heart, Search, BellRing, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS = { ShoppingBag, Medal, Award, Trophy, Heart, Search, BellRing };

const Profile = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [savings, setSavings] = useState(null);

  useEffect(() => {
    api.get("/users/price-alerts").then(({ data }) => setAlerts(data.priceAlerts));
    api.get("/users/savings").then(({ data }) => setSavings(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-slate-100 p-6 flex items-center gap-4 mb-6">
        <div className="bg-navy text-white rounded-full w-14 h-14 flex items-center justify-center font-display font-bold text-xl">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-navy">{user?.name}</h1>
          <p className="text-slate-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link to="/orders" className="bg-white rounded-xl border border-slate-100 p-4 text-center hover:border-mustard transition-colors">
          <p className="font-display font-bold text-navy">Orders</p><p className="text-xs text-slate-400">Track & view</p>
        </Link>
        <Link to="/wishlist" className="bg-white rounded-xl border border-slate-100 p-4 text-center hover:border-mustard transition-colors">
          <p className="font-display font-bold text-navy">Wishlist</p><p className="text-xs text-slate-400">Saved items</p>
        </Link>
        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
          <p className="font-display font-bold text-navy">{alerts.length}</p><p className="text-xs text-slate-400">Price Alerts</p>
        </div>
      </div>

      {/* SAVINGS TRACKER + GAMIFICATION */}
      {savings && (
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 mb-6 text-white">
          <p className="text-sm text-white/70 mb-1">Total money saved on PriceRadar</p>
          <p className="font-display font-extrabold text-4xl text-mustard mb-4">
            {formatINR(savings.totalSaved)}
          </p>
          <div className="flex items-center gap-4 text-sm text-white/80 mb-5">
            <span>{savings.orderCount} order{savings.orderCount !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span>{savings.badgesEarned}/{savings.totalBadges} badges earned</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {savings.badges.map((b) => {
              const Icon = ICONS[b.icon] || Trophy;
              return (
                <div key={b.id} className="flex flex-col items-center gap-1.5 group relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${b.earned ? "bg-mustard text-navy" : "bg-white/10 text-white/30"}`}>
                    {b.earned ? <Icon size={20} /> : <Lock size={16} />}
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${b.earned ? "text-white" : "text-white/40"}`}>{b.name}</span>
                  <div className="absolute top-full mt-2 hidden group-hover:block bg-white text-slate-700 text-xs rounded-lg px-2 py-1.5 shadow-lg w-36 z-10">
                    {b.description}
                  </div>
                </div>
              );
            })}
          </div>
          {savings.nextBadge && (
            <p className="text-xs text-white/60 mt-4">
              Next badge: <span className="text-mustard font-semibold">{savings.nextBadge.name}</span> — {savings.nextBadge.description}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="flex items-center gap-2 font-display font-semibold text-navy mb-4"><Bell size={16} /> Active Price Alerts</h3>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-400">No active price alerts. Set one from any product page.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={a.product?.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                  <Link to={`/product/${a.product?.slug}`} className="text-sm text-slate-700 hover:text-navy line-clamp-1">{a.product?.title}</Link>
                  <p className="text-xs text-slate-400">Alert below <span className="font-mono-price font-semibold text-navy">{formatINR(a.targetPrice)}</span></p>
                </div>
                {a.product?.lowestPrice <= a.targetPrice && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Target hit! 🎉</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
