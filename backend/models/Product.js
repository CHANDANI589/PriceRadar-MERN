const mongoose = require("mongoose");

const platformPriceSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["Amazon", "Flipkart", "Meesho", "Myntra", "Ajio", "PriceRadar"],
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    url: { type: String, default: "#" },
    rating: { type: Number, min: 0, max: 5, default: 4 },
    deliveryDays: { type: Number, default: 3 },
    inStock: { type: Boolean, default: true },
    logo: { type: String, default: "" },
  },
  { _id: false }
);

const priceHistoryPointSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, default: "Generic" },
    category: {
      type: String,
      required: true,
      enum: [
        "Mobiles",
        "Laptops",
        "Fashion",
        "Home & Kitchen",
        "Electronics",
        "Beauty",
        "Footwear",
        "Accessories",
      ],
    },
    description: { type: String, default: "" },
    images: [{ type: String }],
    specs: { type: Map, of: String },

    // Own marketplace fields (PriceRadar-owned inventory)
    ourStock: { type: Number, default: 0 },
    isOwnListing: { type: Boolean, default: true },

    // Cross-platform price comparison data
    platformPrices: [platformPriceSchema],
    priceHistory: [priceHistoryPointSchema],

    lowestPrice: { type: Number, default: 0 },
    lowestPricePlatform: { type: String, default: "PriceRadar" },
    highestPrice: { type: Number, default: 0 },

    avgRating: { type: Number, default: 4 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],

    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ title: "text", brand: "text", tags: "text" });

// Recompute lowest/highest price across all platforms before saving
productSchema.methods.recomputePriceStats = function () {
  if (!this.platformPrices || this.platformPrices.length === 0) return;
  const inStockPrices = this.platformPrices.filter((p) => p.inStock);
  const list = inStockPrices.length ? inStockPrices : this.platformPrices;
  const lowest = list.reduce((a, b) => (a.price < b.price ? a : b));
  const highest = list.reduce((a, b) => (a.price > b.price ? a : b));
  this.lowestPrice = lowest.price;
  this.lowestPricePlatform = lowest.platform;
  this.highestPrice = highest.price;
};

module.exports = mongoose.model("Product", productSchema);
