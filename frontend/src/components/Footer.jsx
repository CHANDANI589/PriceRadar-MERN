import { Link } from "react-router-dom";
import { Radar } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-dark text-white/70 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Radar className="text-mustard" size={22} />
          <span className="font-display font-bold text-white text-lg">PriceRadar</span>
        </div>
        <p className="text-sm line-clamp-2">
          India's smartest price-comparison platform. Live prices via Google Shopping.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li>Mobiles</li>
          <li>Laptops</li>
          <li>Fashion</li>
          <li>Electronics</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
        <ul className="space-y-2 text-sm">
          <li>My Orders</li>
          <li>Wishlist</li>
          <li>Price Alerts</li>
          <li>Savings Tracker</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Note</h4>
        <p className="text-sm">
          Live prices via Google Shopping. Catalog prices are demo.
        </p>
      </div>
    </div>
    <div className="border-t border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs">
        <div className="flex gap-4 text-white/60 text-sm">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="hover:text-white transition-colors"
          >
            Terms
          </Link>
        </div>
        <div className="text-white/70 text-xs">
          © {new Date().getFullYear()} PriceRadar
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
