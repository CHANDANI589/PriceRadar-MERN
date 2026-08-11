import { Radar } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-dark text-white/70 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Radar className="text-mustard" size={22} />
          <span className="font-display font-bold text-white text-lg">PriceRadar</span>
        </div>
        <p className="text-sm leading-relaxed">
          India's smartest price-comparison shopping platform. Real-time live search powered by
          Google Shopping, plus our own catalog with checkout, alerts, and savings tracking.
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
        <p className="text-sm leading-relaxed">
          Live Search results are real-time via Google Shopping (SerpApi). Catalog products use
          simulated pricing for demonstration purposes.
        </p>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs">
      © {new Date().getFullYear()} PriceRadar. Built with the MERN stack.
    </div>
  </footer>
);

export default Footer;
