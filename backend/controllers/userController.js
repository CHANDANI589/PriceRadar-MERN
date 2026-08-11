const User = require("../models/User");

// @route POST /api/users/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.findIndex((id) => id.toString() === req.params.productId);
    let action;
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      action = "removed";
    } else {
      user.wishlist.push(req.params.productId);
      action = "added";
    }
    await user.save();
    res.json({ success: true, action, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/users/recently-viewed
exports.getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("recentlyViewed");
    res.json({ success: true, recentlyViewed: user.recentlyViewed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/users/price-alerts
exports.addPriceAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const user = await User.findById(req.user._id);
    user.priceAlerts.push({ product: productId, targetPrice });
    await user.save();
    res.status(201).json({ success: true, priceAlerts: user.priceAlerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/users/price-alerts
exports.getPriceAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("priceAlerts.product");
    res.json({ success: true, priceAlerts: user.priceAlerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/users/addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/users/savings
// Unique feature: Savings Tracker + Gamification. Aggregates how much the
// user has saved across all orders and computes which badges they've earned.
exports.getSavings = async (req, res) => {
  try {
    const Order = require("../models/Order");
    const orders = await Order.find({ user: req.user._id });
    const totalSaved = orders.reduce((sum, o) => sum + (o.savedAmount || 0), 0);
    const orderCount = orders.length;

    const user = await User.findById(req.user._id).populate("priceAlerts.product");
    const wishlistCount = user.wishlist.length;
    const alertsHit = user.priceAlerts.filter(
      (a) => a.product && a.product.lowestPrice <= a.targetPrice
    ).length;

    const badges = [
      {
        id: "first_order",
        name: "First Purchase",
        description: "Placed your first order on PriceRadar",
        icon: "ShoppingBag",
        earned: orderCount >= 1,
      },
      {
        id: "bronze_saver",
        name: "Bronze Saver",
        description: "Saved ₹500+ across all purchases",
        icon: "Medal",
        earned: totalSaved >= 500,
      },
      {
        id: "silver_saver",
        name: "Silver Saver",
        description: "Saved ₹2,000+ across all purchases",
        icon: "Award",
        earned: totalSaved >= 2000,
      },
      {
        id: "gold_saver",
        name: "Gold Saver",
        description: "Saved ₹5,000+ across all purchases",
        icon: "Trophy",
        earned: totalSaved >= 5000,
      },
      {
        id: "loyal_shopper",
        name: "Loyal Shopper",
        description: "Placed 5 or more orders",
        icon: "Heart",
        earned: orderCount >= 5,
      },
      {
        id: "deal_hunter",
        name: "Deal Hunter",
        description: "Saved 10+ products to your wishlist",
        icon: "Search",
        earned: wishlistCount >= 10,
      },
      {
        id: "alert_master",
        name: "Alert Master",
        description: "Had a price alert target successfully hit",
        icon: "BellRing",
        earned: alertsHit >= 1,
      },
    ];

    const nextBadge = badges.find((b) => !b.earned);

    res.json({
      success: true,
      totalSaved,
      orderCount,
      wishlistCount,
      badgesEarned: badges.filter((b) => b.earned).length,
      totalBadges: badges.length,
      badges,
      nextBadge: nextBadge || null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
