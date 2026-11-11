require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shoppingRoutes = require("./routes/shoppingRoutes");
const passport = require("passport");

const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  process.env.CLIENT_URL, // deployed frontend (set via Render env var in production)
  "http://localhost:5173", // local development
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));

// ===============================
// ROOT ROUTE
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "PriceRadar API is running",
  });
});

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shopping", shoppingRoutes);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Server error",
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});