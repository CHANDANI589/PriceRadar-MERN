const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required for SameSite=none; always send over HTTPS
    sameSite: "none", // required for cross-site (frontend != backend) cookie inclusion
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // cookie available across the whole backend domain
  });
};

module.exports = { generateToken, setTokenCookie };