import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, Zap } from "lucide-react";

const CATEGORIES = [
  "Mobiles",
  "Laptops",
  "Fashion",
  "Home & Kitchen",
  "Electronics",
  "Beauty",
  "Footwear",
  "Accessories",
];

const PRICE_LIMITS = [500, 1000, 2000, 5000, 20000, 60000];

const SearchResults = () => {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";
  const urlCategory = params.get("category") || "";
  const urlMaxPrice = params.get("maxPrice") || "";
  const urlSort = params.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Keep filter values directly connected to URL.
   * This prevents old/stale category values.
   */
  const category = urlCategory;
  const maxPrice = urlMaxPrice;
  const sort = urlSort;

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams();

        if (q.trim()) {
          query.set("search", q.trim());
        }

        if (category) {
          query.set("category", category);
        }

        if (maxPrice) {
          query.set("maxPrice", maxPrice);
        }

        if (sort) {
          query.set("sort", sort);
        }

        query.set("limit", "24");

        const { data } = await api.get(`/products?${query.toString()}`);

        if (!cancelled) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (err) {
        console.error("Search products error:", err);

        if (!cancelled) {
          setProducts([]);
          setError(
            err.response?.data?.message ||
              "Unable to load products. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [q, category, maxPrice, sort]);

  /*
   * Update one filter without losing the others.
   */
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);

    if (value === "" || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }

    setParams(next);
  };

  /*
   * Category selection
   */
  const handleCategory = (value) => {
    updateFilter("category", value);
  };

  /*
   * Price selection
   */
  const handlePrice = (value) => {
    updateFilter("maxPrice", value);
  };

  /*
   * Sort selection
   */
  const handleSort = (value) => {
    updateFilter("sort", value);
  };

  /*
   * Clear all filters.
   *
   * Search query is intentionally preserved.
   */
  const clearFilters = () => {
    const next = new URLSearchParams();

    if (q) {
      next.set("q", q);
    }

    setParams(next);
  };

  /*
   * Sort products on frontend as an extra safety layer.
   *
   * This means even if backend sorting is inconsistent,
   * the displayed products will still be sorted correctly.
   */
  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "price_low") {
      list.sort(
        (a, b) =>
          Number(a.lowestPrice || 0) -
          Number(b.lowestPrice || 0)
      );
    }

    if (sort === "price_high") {
      list.sort(
        (a, b) =>
          Number(b.lowestPrice || 0) -
          Number(a.lowestPrice || 0)
      );
    }

    if (sort === "rating") {
      list.sort(
        (a, b) =>
          Number(b.avgRating || 0) -
          Number(a.avgRating || 0)
      );
    }

    return list;
  }, [products, sort]);

  /*
   * Show what filters are currently active.
   */
  const activeFilters = [];

  if (category) {
    activeFilters.push(category);
  }

  if (maxPrice) {
    activeFilters.push(`Under ₹${Number(maxPrice).toLocaleString("en-IN")}`);
  }

  if (sort === "price_low") {
    activeFilters.push("Price: Low to High");
  }

  if (sort === "price_high") {
    activeFilters.push("Price: High to Low");
  }

  if (sort === "rating") {
    activeFilters.push("Top Rated");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* =========================
          HEADER
      ========================== */}

      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">

        <h1 className="font-display font-bold text-2xl text-navy">
          {q
            ? `Catalog results for "${q}"`
            : "Browse our catalog"}
        </h1>

        {q && (
          <Link
            to={`/live-search?q=${encodeURIComponent(q)}`}
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-navy
              bg-mustard/20
              hover:bg-mustard/30
              px-3
              py-1.5
              rounded-full
              transition-colors
            "
          >
            <Zap size={14} />
            Try Live Search instead
          </Link>
        )}
      </div>

      {/* =========================
          RESULT COUNT
      ========================== */}

      <p className="text-slate-500 text-sm mb-3">
        {loading
          ? "Finding products..."
          : `${sortedProducts.length} products found in our demo catalog`}
      </p>

      {/* =========================
          ACTIVE FILTERS
      ========================== */}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">

          <span className="text-xs text-slate-400">
            Active filters:
          </span>

          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="
                text-xs
                bg-mustard/15
                text-navy
                px-2.5
                py-1
                rounded-full
                font-medium
              "
            >
              {filter}
            </span>
          ))}

          <button
            onClick={clearFilters}
            className="
              text-xs
              text-coral
              font-medium
              hover:underline
            "
          >
            Clear all
          </button>

        </div>
      )}

      {/* =========================
          MAIN GRID
      ========================== */}

      <div className="grid md:grid-cols-[220px_1fr] gap-6">

        {/* =========================
            SIDEBAR
        ========================== */}

        <aside
          className="
            bg-white
            rounded-xl
            border
            border-slate-100
            p-4
            h-fit
            sticky
            top-20
          "
        >

          <h3
            className="
              flex
              items-center
              gap-2
              font-semibold
              text-sm
              text-navy
              mb-4
            "
          >
            <SlidersHorizontal size={15} />
            Filters
          </h3>

          {/* =========================
              CATEGORY
          ========================== */}

          <div className="mb-5">

            <p
              className="
                text-xs
                font-semibold
                text-slate-500
                mb-2
                uppercase
              "
            >
              Category
            </p>

            <div className="space-y-1.5">

              <button
                onClick={() => handleCategory("")}
                className={`
                  block
                  text-sm
                  w-full
                  text-left
                  px-2
                  py-1
                  rounded
                  ${
                    !category
                      ? "text-mustard-dark font-semibold bg-mustard/10"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                All Categories
              </button>

              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategory(c)}
                  className={`
                    block
                    text-sm
                    w-full
                    text-left
                    px-2
                    py-1
                    rounded
                    ${
                      category === c
                        ? "text-mustard-dark font-semibold bg-mustard/10"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  {c}
                </button>
              ))}

            </div>
          </div>

          {/* =========================
              BUDGET
          ========================== */}

          <div className="mb-5">

            <p
              className="
                text-xs
                font-semibold
                text-slate-500
                mb-2
                uppercase
              "
            >
              Budget (Low Price Mode)
            </p>

            <div className="space-y-1.5">

              {PRICE_LIMITS.map((value) => (
                <button
                  key={value}
                  onClick={() => handlePrice(value)}
                  className={`
                    block
                    text-sm
                    w-full
                    text-left
                    px-2
                    py-1
                    rounded
                    ${
                      Number(maxPrice) === value
                        ? "text-mustard-dark font-semibold bg-mustard/10"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  Under ₹
                  {value.toLocaleString("en-IN")}
                </button>
              ))}

              <button
                onClick={() => handlePrice("")}
                className="
                  text-xs
                  text-coral
                  mt-1
                  hover:underline
                "
              >
                Clear
              </button>

            </div>
          </div>

          {/* =========================
              SORT
          ========================== */}

          <div>

            <p
              className="
                text-xs
                font-semibold
                text-slate-500
                mb-2
                uppercase
              "
            >
              Sort by
            </p>

            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="
                w-full
                text-sm
                border
                border-slate-200
                rounded-lg
                px-2
                py-1.5
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-mustard
              "
            >
              <option value="">
                Relevance
              </option>

              <option value="price_low">
                Price: Low to High
              </option>

              <option value="price_high">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>
            </select>

          </div>

        </aside>

        {/* =========================
            PRODUCTS
        ========================== */}

        <div>

          {/* Loading */}

          {loading && (
            <div className="text-center py-20">
              <div
                className="
                  inline-block
                  w-8
                  h-8
                  border-4
                  border-slate-200
                  border-t-mustard
                  rounded-full
                  animate-spin
                  mb-4
                "
              />

              <p className="text-slate-400">
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="text-center py-20">

              <p className="text-coral font-medium mb-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="
                  bg-mustard
                  text-navy
                  px-4
                  py-2
                  rounded-full
                  font-semibold
                  text-sm
                "
              >
                Try Again
              </button>

            </div>
          )}

          {/* No products */}

          {!loading &&
            !error &&
            sortedProducts.length === 0 && (
              <div className="text-center py-20">

                <p className="text-slate-400 mb-3">
                  No products match your filters in our catalog.
                </p>

                <p className="text-xs text-slate-400 mb-5">
                  Try removing the category, price filter,
                  or search keyword.
                </p>

                <button
                  onClick={clearFilters}
                  className="
                    bg-mustard
                    hover:bg-mustard-light
                    text-navy
                    px-5
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                  "
                >
                  Clear Filters
                </button>

                {q && (
                  <div className="mt-4">

                    <Link
                      to={`/live-search?q=${encodeURIComponent(q)}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-sm
                        font-semibold
                        text-navy
                        bg-mustard/20
                        px-4
                        py-2
                        rounded-full
                      "
                    >
                      <Zap size={14} />
                      Search "{q}" live instead
                    </Link>

                  </div>
                )}

              </div>
            )}

          {/* Product cards */}

          {!loading &&
            !error &&
            sortedProducts.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-4
                "
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default SearchResults;