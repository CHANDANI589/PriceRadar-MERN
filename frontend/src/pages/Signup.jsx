import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Radar } from "lucide-react";
import toast from "react-hot-toast";

const GOOGLE_AUTH_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")}/api/auth/google`;

const GoogleButton = () => (
  <a
    href={GOOGLE_AUTH_URL}
    className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
  >
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <path fill="#4285F4" d="M12 23c6.07 0 11-4.93 11-11S18.07 1 12 1 1 5.93 1 13s4.93 11 11 11z" />
      <path fill="#DB4437" d="M22 12c0-5.52-4.48-10-10-10V1c5.52 0 10 4.48 10 10s-4.48 10-10 10v-2c0-5.52 4.48-10 10-10z" />
      <path fill="#F4B400" d="M12 1c-1.91 0-3.7.65-5.19 1.78L6.72 2c1.38-.55 2.8-.87 4.29-.87s2.91.32 4.29.87L17.19 2.78c-1.49-1.13-3.28-1.78-5.19-1.78z" />
      <path fill="#0F9D58" d="M12 23c-2.97 0-5.46-.98-7.28-2.66l3.57-2.77c.98-.66 2.23-1.06 3.71-1.06 2.86 0 5.29 1.93 5.94 4.63H20.4v-2.78c-1.39-1.93-3.67-3.14-6.23-3.14z" />
    </svg>
    Continue with Google
  </a>
);

const Divider = () => (
  <div className="relative text-slate-400 text-xs font-semibold mb-4 mt-2">
    <span className="px-2 bg-white">Or continue with</span>
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-slate-200"></span>
    </div>
  </div>
);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
        <h1 className="font-display font-bold text-xl text-navy text-center mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Start comparing prices in seconds</p>

        <GoogleButton />
        <Divider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-mustard focus:outline-none" placeholder="Riya Sharma" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-mustard focus:outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 mt-1 text-sm focus:ring-2 focus:ring-mustard focus:outline-none" placeholder="At least 6 characters" />
          </div>
          <button disabled={loading} className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center text-slate-500 mt-5">
          Already have an account? <Link to="/login" className="text-navy font-semibold hover:text-mustard-dark">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
