import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Radar } from "lucide-react";
import toast from "react-hot-toast";

const GOOGLE_AUTH_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")}/api/auth/google`;

const GoogleButton = () => (
  <a
    href={GOOGLE_AUTH_URL}
    className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg transition-colors text-sm"
  >
<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
    Continue with Google
  </a>
);

const Divider = () => (
  <div className="my-4 flex items-center">
    <div className="flex-1 border-t border-slate-200"></div>
    <span className="px-2 bg-white text-slate-400 text-xs font-semibold">Or continue with</span>
    <div className="flex-1 border-t border-slate-200"></div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Surface Google OAuth result (success/error) returned by the backend callback.
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_failed" || error === "google_auth_failed") {
      toast.error("Google sign-in failed. Please try again or log in with email/password.");
    }
  }, [searchParams]);

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

        <GoogleButton />
        <Divider />

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
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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


