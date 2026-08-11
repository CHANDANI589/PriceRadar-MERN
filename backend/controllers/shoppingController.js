const { getJson } = require("serpapi");

const SERPAPI_KEY = process.env.SERPAPI_KEY;

// @route GET /api/shopping/search?q=iphone
// Real, live product search powered by Google Shopping (via SerpApi).
// Returns real titles, real photos, and real prices from real stores.
exports.searchShopping = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: "Search query 'q' is required" });
    }
    if (!SERPAPI_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "SERPAPI_KEY is not configured on the backend. Add it to backend/.env (see README).",
      });
    }

    const json = await getJson({
      engine: "google_shopping",
      q,
      gl: "in", // India results
      hl: "en",
      api_key: SERPAPI_KEY,
    });

    const results = (json.shopping_results || []).map((item, i) => ({
      productId: item.product_id || `pos-${item.position || i}`,
      title: item.title,
      image: item.thumbnail,
      price: item.extracted_price ?? null,
      priceDisplay: item.price,
      source: item.source,
      rating: item.rating || null,
      reviews: item.reviews || null,
      link: item.product_link || item.link,
    }));

    res.json({ success: true, count: results.length, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/shopping/offers?product_id=xxxx&title=...
// Real multi-seller price comparison for ONE specific product. Tries Google's
// dedicated "Compare Prices" data first (google_product engine). Many
// smaller/regional products don't have that aggregated data, so if it comes
// back empty we fall back to a plain Google Shopping search on the product's
// title — this still surfaces the same item listed by multiple real stores
// for mainstream products, and at minimum shows similar real listings
// instead of a hard failure.
exports.getProductOffers = async (req, res) => {
  const { product_id, title } = req.query;

  if (!product_id && !title) {
    return res.status(400).json({ success: false, message: "product_id or title is required" });
  }
  if (!SERPAPI_KEY) {
    return res.status(500).json({
      success: false,
      message: "SERPAPI_KEY is not configured on the backend. Add it to backend/.env (see README).",
    });
  }

  let offers = [];
  let productTitle = title || "";
  let images = [];
  let description = "";

  // Attempt 1: Google's aggregated "Compare Prices" data for this exact product.
  // Skip if the id is one of our synthetic fallback ids (no real product_id).
  if (product_id && !String(product_id).startsWith("pos-")) {
    try {
      const json = await getJson({
        engine: "google_product",
        product_id,
        gl: "in",
        hl: "en",
        api_key: SERPAPI_KEY,
      });

      if (json.error) {
        console.warn("[shopping] google_product returned an error:", json.error);
      } else {
        const productInfo = json.product_results || {};
        productTitle = productInfo.title || productTitle;
        description = productInfo.description || "";
        images =
          productInfo.images ||
          (productInfo.media ? productInfo.media.map((m) => m.link).filter(Boolean) : []);

        const sellerList =
          (json.sellers_results &&
            (json.sellers_results.online_sellers || json.sellers_results.results)) ||
          [];

        offers = sellerList.map((s) => ({
          source: s.name || s.source || "Unknown store",
          price: s.extracted_price ?? s.base_price ?? s.extracted_total_price ?? null,
          priceDisplay: s.price || s.total_price || "",
          link: s.link || s.direct_link || "#",
        }));
      }
    } catch (e) {
      console.warn("[shopping] google_product engine failed:", e.message);
    }
  }

  // Attempt 2 (fallback): search Google Shopping by the product's own title
  // and treat each real listing as a comparison row.
  if (offers.length === 0 && productTitle) {
    try {
      const json2 = await getJson({
        engine: "google_shopping",
        q: productTitle,
        gl: "in",
        hl: "en",
        api_key: SERPAPI_KEY,
      });
      const shoppingResults = json2.shopping_results || [];
      offers = shoppingResults.slice(0, 10).map((item) => ({
        source: item.source || "Unknown store",
        price: item.extracted_price ?? null,
        priceDisplay: item.price || "",
        link: item.product_link || item.link || "#",
      }));
      if (images.length === 0 && shoppingResults[0]?.thumbnail) {
        images = [shoppingResults[0].thumbnail];
      }
    } catch (e) {
      console.warn("[shopping] fallback title search failed:", e.message);
    }
  }

  offers.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

  res.json({ success: true, title: productTitle, images, description, offers });
};
