import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogOut, Menu, X, Radar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Live search hits the real Google Shopping (SerpApi) results —
      // real products, real images, real prices from real stores.
      navigate(`/live-search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-card">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Radar className="text-mustard" size={28} strokeWidth={2.2} />
          <span className="text-white font-display font-extrabold text-xl tracking-tight">
            Price<span className="text-mustard">Radar</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any real product — phones, dresses, shoes..."
              className="w-full rounded-full py-2.5 pl-4 pr-11 text-sm text-slate-text bg-white focus:outline-none focus:ring-2 focus:ring-mustard placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-mustard hover:bg-mustard-light text-navy p-1.5 rounded-full transition-colors"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        <div className="hidden md:flex items-center gap-5 ml-auto">
          <Link to="/search" className="text-white/80 hover:text-mustard text-sm transition-colors" title="Browse our catalog">
            Catalog
          </Link>
          <Link to="/wishlist" className="text-white/90 hover:text-mustard transition-colors" title="Wishlist">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="relative text-white/90 hover:text-mustard transition-colors" title="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-coral text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === "admin" ? "/admin" : "/profile"}
                className="flex items-center gap-1.5 text-white/90 hover:text-mustard text-sm font-medium transition-colors"
              >
                <User size={18} /> {user.name.split(" ")[0]}
              </Link>
              <button onClick={logout} title="Logout" className="text-white/70 hover:text-coral transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white text-sm font-semibold hover:text-mustard transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-mustard text-navy text-sm font-bold px-4 py-1.5 rounded-full hover:bg-mustard-light transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-dark px-4 py-4 space-y-3 animate-fadeUp">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full py-2.5 pl-4 pr-11 text-sm bg-white focus:outline-none"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-mustard text-navy p-1.5 rounded-full">
                <Search size={16} />
              </button>
            </div>
          </form>
          <div className="flex justify-between text-white text-sm pt-2">
            <Link to="/search" onClick={() => setMenuOpen(false)}>Catalog</Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({totalItems})</Link>
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
