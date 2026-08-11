const Product = require("../models/Product");

// @route GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { brand: regex }, { tags: regex }, { category: regex }];
    }
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.lowestPrice = {};
      if (minPrice) filter.lowestPrice.$gte = Number(minPrice);
      if (maxPrice) filter.lowestPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_low") sortOption = { lowestPrice: 1 };
    if (sort === "price_high") sortOption = { lowestPrice: -1 };
    if (sort === "rating") sortOption = { avgRating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, count: products.length, total, page: Number(page), products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // track recently viewed if logged in
    if (req.user) {
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { recentlyViewed: product._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { recentlyViewed: { $each: [product._id], $position: 0, $slice: 10 } },
      });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/:slug/predict
// Unique feature: Smart Buy Predictor. Runs a simple least-squares linear
// regression over the recent price history to detect whether prices are
// trending down (worth waiting) or flat/rising (good time to buy).
exports.predictBuyTiming = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const history = [...product.priceHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (history.length < 6) {
      return res.json({
        success: true,
        recommendation: "BUY_NOW",
        confidence: "Low",
        reason: "Not enough price history yet to detect a reliable trend.",
        currentPrice: product.lowestPrice,
        predictedPrice7d: product.lowestPrice,
        trendPercent: 0,
      });
    }

    // Average price per day across all platforms, then take the recent window
    const byDate = {};
    history.forEach((h) => {
      const key = new Date(h.date).toISOString().slice(0, 10);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(h.price);
    });
    const series = Object.entries(byDate)
      .map(([date, prices]) => ({
        date,
        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const recent = series.slice(-10); // last ~10 data points
    const n = recent.length;
    const xs = recent.map((_, i) => i);
    const ys = recent.map((p) => p.avg);

    // Least-squares linear regression: slope = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²
    const xMean = xs.reduce((a, b) => a + b, 0) / n;
    const yMean = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - xMean) * (ys[i] - yMean);
      den += (xs[i] - xMean) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;

    const currentPrice = product.lowestPrice;
    const predictedPrice7d = Math.max(50, Math.round(intercept + slope * (n + 6)));
    const trendPercent = Math.round(((predictedPrice7d - currentPrice) / currentPrice) * 1000) / 10;

    // Consistency (R²) drives our confidence label
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const predicted = intercept + slope * xs[i];
      ssRes += (ys[i] - predicted) ** 2;
      ssTot += (ys[i] - yMean) ** 2;
    }
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    const confidence = r2 > 0.6 ? "High" : r2 > 0.3 ? "Medium" : "Low";

    let recommendation = "BUY_NOW";
    let reason = `Prices have been stable over the last ${n} data points — this is a good time to buy.`;

    if (trendPercent <= -3) {
      recommendation = "WAIT";
      reason = `Prices have dropped ~${Math.abs(trendPercent)}% recently and the trend suggests they may fall further over the next week.`;
    } else if (trendPercent >= 3) {
      recommendation = "BUY_NOW";
      reason = `Prices are trending up (~${trendPercent}% over the last week) — buying now avoids paying more later.`;
    }

    res.json({
      success: true,
      recommendation,
      confidence,
      reason,
      currentPrice,
      predictedPrice7d,
      trendPercent,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.comparePrices = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const sorted = [...product.platformPrices].sort((a, b) => a.price - b.price);
    res.json({
      success: true,
      cheapest: sorted[0],
      comparison: sorted,
      priceHistory: product.priceHistory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/products/:slug/simulate-update  (unique feature: simulate a live price refresh)
exports.simulatePriceUpdate = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.platformPrices = product.platformPrices.map((p) => {
      const fluctuation = Math.round(p.price * (Math.random() * 0.08 - 0.04)); // +-4%
      const newPrice = Math.max(50, p.price + fluctuation);
      product.priceHistory.push({ platform: p.platform, price: newPrice, date: new Date() });
      return { ...p.toObject(), price: newPrice };
    });
    product.recomputePriceStats();
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/products/:slug/reviews
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ success: false, message: "You already reviewed this product" });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.numReviews = product.reviews.length;
    product.avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/products/categories/list
exports.getCategories = async (req, res) => {
  const categories = await Product.distinct("category");
  res.json({ success: true, categories });
};

// @route POST /api/products (admin)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.recomputePriceStats();
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    Object.assign(product, req.body);
    product.recomputePriceStats();
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
