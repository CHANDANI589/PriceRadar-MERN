const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // true over HTTPS in production, false over HTTP in development
    sameSite: isProduction ? "none" : "lax", // "none" for cross-site production, "lax" for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = { generateToken, setTokenCookie };