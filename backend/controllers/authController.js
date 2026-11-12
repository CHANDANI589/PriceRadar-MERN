const User = require("../models/User");
const { generateToken, setTokenCookie } = require("../utils/generateToken");
const isProduction = process.env.NODE_ENV === "production";

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/auth/logout
exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route GET /api/auth/google/callback (handled after Passport strategy)
exports.googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`);
    }

    const token = generateToken(req.user._id);
    setTokenCookie(res, token);
    console.log("Google OAuth callback: token cookie set, redirecting to frontend");

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    console.log("Google OAuth callback: redirecting to", `${frontendUrl}/?google_auth=success`);
    return res.redirect(`${frontendUrl}/?google_auth=success`);
  } catch (err) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
  }
};
