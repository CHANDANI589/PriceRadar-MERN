import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Radar } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Radar className="text-mustard" size={26} />
          <span className="font-display font-bold text-xl text-navy">
            Price<span className="text-mustard-dark">Radar</span>
          </span>
        </div>
        <h1 className="font-display font-bold text-xl text-navy text-center mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Login to track deals & manage orders</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-mustard focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-mustard focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button disabled={loading} className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4 bg-slate-50 rounded-lg p-2">
          Demo: demo@priceradar.com / demo1234 &nbsp;|&nbsp; Admin: admin@priceradar.com / admin123
        </p>
        <p className="text-sm text-center text-slate-500 mt-5">
          Don't have an account? <Link to="/signup" className="text-navy font-semibold hover:text-mustard-dark">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
