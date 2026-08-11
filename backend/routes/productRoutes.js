const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  comparePrices,
  simulatePriceUpdate,
  addReview,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  predictBuyTiming,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

// public
router.get("/", getProducts);
router.get("/categories/list", getCategories);
router.get("/:slug", (req, res, next) => {
  // optional auth: attach user if token present, but don't block
  const { protect: p } = require("../middleware/auth");
  const jwt = require("jsonwebtoken");
  const token = req.cookies?.token;
  if (!token) return getProductBySlug(req, res, next);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    require("../models/User")
      .findById(decoded.id)
      .then((user) => {
        req.user = user;
        getProductBySlug(req, res, next);
      });
  } catch {
    getProductBySlug(req, res, next);
  }
});
router.get("/:slug/compare", comparePrices);
router.get("/:slug/predict", predictBuyTiming);
router.post("/:slug/simulate-update", simulatePriceUpdate);

// protected
router.post("/:slug/reviews", protect, addReview);

// admin only
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
