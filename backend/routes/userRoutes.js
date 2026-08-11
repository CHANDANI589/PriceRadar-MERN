const express = require("express");
const router = express.Router();
const {
  toggleWishlist,
  getWishlist,
  getRecentlyViewed,
  addPriceAlert,
  getPriceAlerts,
  updateProfile,
  addAddress,
  getSavings,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", toggleWishlist);
router.get("/recently-viewed", getRecentlyViewed);
router.get("/price-alerts", getPriceAlerts);
router.post("/price-alerts", addPriceAlert);
router.get("/savings", getSavings);
router.put("/profile", updateProfile);
router.post("/addresses", addAddress);

module.exports = router;
