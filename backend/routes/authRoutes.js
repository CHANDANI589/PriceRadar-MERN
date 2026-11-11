const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, logout, getMe, googleAuthCallback } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

require("../config/passport")(passport);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google_failed`,
  }),
  googleAuthCallback
);

module.exports = router;
