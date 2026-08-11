# PriceRadar — MERN Price Comparison & Shopping Platform

A full-stack (MongoDB, Express, React, Node.js) price-comparison + shopping platform with
**two search modes**:

1. **Live Search** — real-time real products, real photos, real prices from real stores,
   powered by Google Shopping via the SerpApi integration.
2. **Catalog Search** — a 90-product demo catalog with full checkout, price alerts,
   reviews, and admin management (for a self-contained offline demo).

Plus three features BuyHatke doesn't have: **Smart Buy Predictor** (trend-based buy/wait
recommendation), **Savings Tracker + Gamification** (badges for money saved), and animated
**Price Race** comparison bars.

---

## ✨ Features

**Live Search (real-time, via SerpApi/Google Shopping)**
- Search ANY real product — returns real titles, real photos, real prices from real stores
- Click a result to see a real multi-seller price comparison table (cheapest highlighted)
- "Visit Store" links go directly to the real retailer page

**Catalog + Shopping (own demo inventory)**
- JWT auth (signup/login/logout), profile, admin panel
- 90 seeded products with multi-platform simulated prices, 30-day price history
- Animated "Price Race" comparison bars, cheapest platform glows gold
- Cart, checkout, order history, wishlist, price alerts

**Unique differentiators (not in BuyHatke)**
1. **Smart Buy Predictor** — a least-squares linear regression trend algorithm over price
   history recommends "Buy Now" vs "Wait" with a 7-day price projection and confidence score
2. **Savings Tracker + Gamification** — tracks total ₹ saved across orders, unlocks badges
   (Bronze/Silver/Gold Saver, Loyal Shopper, Deal Hunter, Alert Master)
3. Animated Price Race visual, live price simulation, auto-scrolling "Supported Stores" marquee

---

## 🧱 Tech Stack

- **Frontend**: React 18 (Vite), React Router, Tailwind CSS, Recharts, lucide-react, react-hot-toast
- **Backend**: Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, **serpapi** (official SDK)
- **Live data**: SerpApi (Google Shopping + Google Product engines)
- **Images**: Pexels API for catalog photos (optional, falls back to LoremFlickr)

---

## 🚀 Setup & Run Locally — following your SerpApi flow

### STEP 1 — Create a SerpApi account
Go to **https://serpapi.com/** → Sign up (free tier: 100 searches/month, no credit card needed
to start).

### STEP 2 — Get your API key
Dashboard → copy your **API Key**.

### STEP 3 — API Key → backend/.env
```bash
cd backend
cp .env.example .env
```
Open `.env` and paste your key:
```
SERPAPI_KEY=your_key_here
MONGO_URI=mongodb://127.0.0.1:27017/priceradar
```
(Optional) also add a free `PEXELS_API_KEY` from https://www.pexels.com/api/ for better
catalog images — this is separate from SerpApi and only affects the demo catalog, not Live Search.

### STEP 4 — Backend mein SerpApi install
```bash
npm install
```
(`serpapi` is already listed in `package.json` — this installs it along with everything else.)

### STEP 5 — Shopping API route (already built for you)
- `GET /api/shopping/search?q=<query>` → calls SerpApi's `google_shopping` engine
- `GET /api/shopping/offers?product_id=<id>` → calls SerpApi's `google_product` engine for
  real multi-seller price comparison
- See `backend/controllers/shoppingController.js` and `backend/routes/shoppingRoutes.js`

### STEP 6 — Frontend search connected to the route (already built for you)
- Navbar search bar + Home page search → navigate to `/live-search?q=...`
- `frontend/src/pages/LiveSearch.jsx` calls `/api/shopping/search`
- Clicking a result opens `frontend/src/pages/LiveProductDetail.jsx` which calls
  `/api/shopping/offers` for the real price comparison table

### STEP 7 & 8 — Real products + images + prices + comparison
Once your `SERPAPI_KEY` is in `.env`, search anything on the Live Search page and you'll get
real Google Shopping results end-to-end.

### Seed the demo catalog (separate from Live Search)
```bash
npm run seed     # populates 90 catalog products + demo/admin users
npm run dev       # starts backend on http://localhost:5000
```
Demo accounts: `demo@priceradar.com` / `demo1234` · Admin: `admin@priceradar.com` / `admin123`

### Frontend
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

---

## ⚠️ Important notes

- **SerpApi free tier** gives 100 searches/month — plenty for demos/interviews, but each Live
  Search page load = 1 credit, and opening a product's offers page = 1 more credit. Don't
  refresh excessively while demoing.
- **`google_product` (offers) schema**: SerpApi's response field names can vary slightly by
  product/region. The controller defensively checks multiple possible field names, but if
  offers don't populate for a specific product, open your browser's Network tab, check the
  raw response from `/api/shopping/offers`, and adjust field mapping in
  `shoppingController.js` `getProductOffers()` accordingly — this is normal, expected
  engineering work with any third-party API, not a bug in the core logic.
- **Catalog vs Live Search are intentionally separate systems**: the catalog (90 products) is
  what powers cart/checkout/reviews/savings tracker, since those need products we actually
  "own". Live Search is real external data for browsing/comparison only — there's no "buy on
  PriceRadar" option for live results since we don't have real inventory for them.

---

## 🎓 For your interview / faculty demo

Strong talking points:
- *"I integrated a third-party API (SerpApi/Google Shopping) end-to-end — backend route,
  error handling for missing keys, defensive field-mapping, and a frontend page consuming it."*
- *"I implemented a price-trend prediction algorithm using least-squares linear regression on
  historical time-series data, with an R²-based confidence score."*
- *"I designed a gamification system — badges computed server-side from aggregated order data,
  driving a personalized savings dashboard."*
- Show Live Search finding a real product → click into real multi-seller comparison → contrast
  with the catalog's simulated Price Race for the "why two systems" architecture conversation.

## 🔮 Possible extensions
- Cache Live Search results in MongoDB to reduce SerpApi credit usage
- Real payment gateway integration (Razorpay/Stripe test mode)
- Email notifications when a price alert target is hit
- Socket.io for real-time price-drop push notifications
