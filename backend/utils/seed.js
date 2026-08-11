require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");

// Real product photos via the Pexels API (free, high-quality, accurately
// keyword-matched stock photos) — fetched ONCE at seed time and saved into
// MongoDB, so the running app never depends on a third-party image service
// at runtime. If no PEXELS_API_KEY is set, we fall back to Picsum Photos —
// not keyword-matched, but backed by a rock-solid CDN that basically never
// fails to load (unlike LoremFlickr, which depends on Flickr's own API and
// can be slow/unreachable on some networks). Get a free Pexels key in
// ~1 minute at pexels.com/api for properly relevant images.
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// A deterministic seed per product (from its title) means the same product
// always gets the same Picsum photo across re-seeds, instead of changing randomly.
const seedFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
};

const fallbackImg = (title, offset) =>
  `https://picsum.photos/seed/${seedFromString(title) + offset}/700/700`;

const fetchPexelsImages = async (query, count = 3) => {
  if (!PEXELS_API_KEY) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&size=medium`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.photos || data.photos.length === 0) return null;
    const urls = data.photos.map((p) => p.src.large);
    while (urls.length < count) urls.push(urls[urls.length - 1]);
    return urls;
  } catch {
    return null;
  }
};

const getProductImages = async (p) => {
  const query = p.imgTag.split(",").join(" ");
  const pexelsUrls = await fetchPexelsImages(query, 3);
  if (pexelsUrls) return pexelsUrls;
  return [fallbackImg(p.title, 1), fallbackImg(p.title, 2), fallbackImg(p.title, 3)];
};

const platforms = (base, stockBias = 1) => [
  {
    platform: "Amazon",
    price: Math.round(base * 1.02),
    originalPrice: Math.round(base * 1.25),
    url: "https://www.amazon.in",
    rating: 4.2,
    deliveryDays: 2,
    inStock: true,
  },
  {
    platform: "Flipkart",
    price: Math.round(base * 0.98),
    originalPrice: Math.round(base * 1.2),
    url: "https://www.flipkart.com",
    rating: 4.1,
    deliveryDays: 3,
    inStock: true,
  },
  {
    platform: "Meesho",
    price: Math.round(base * (0.85 + Math.random() * 0.1)),
    originalPrice: Math.round(base * 1.1),
    url: "https://www.meesho.com",
    rating: 3.9,
    deliveryDays: 5,
    inStock: stockBias > 0.1,
  },
  {
    platform: "Myntra",
    price: Math.round(base * 1.08),
    originalPrice: Math.round(base * 1.3),
    url: "https://www.myntra.com",
    rating: 4.3,
    deliveryDays: 4,
    inStock: true,
  },
  {
    platform: "PriceRadar",
    price: Math.round(base * (0.88 + Math.random() * 0.08)),
    originalPrice: Math.round(base * 1.15),
    url: "#",
    rating: 4.5,
    deliveryDays: 2,
    inStock: true,
  },
];

const genHistory = (basePrice, platformNames) => {
  const history = [];
  const days = 30;
  for (let d = days; d >= 0; d -= 3) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    platformNames.forEach((platform) => {
      const noise = basePrice * (Math.random() * 0.15 - 0.07);
      history.push({ platform, price: Math.max(50, Math.round(basePrice + noise)), date });
    });
  }
  return history;
};

const rawProducts = [
  {
    title: "OnePlus Nord CE 4 (8GB/128GB)",
    brand: "OnePlus",
    category: "Mobiles",
    base: 21999,
    desc: "6.7-inch AMOLED display, Snapdragon 7 Gen 3, 100W fast charging, 5500mAh battery.",
    specs: { Display: "6.7\" AMOLED", RAM: "8GB", Storage: "128GB", Battery: "5500mAh" },
    imgTag: "smartphone,mobilephone",
  },
  {
    title: "Samsung Galaxy M35 5G (6GB/128GB)",
    brand: "Samsung",
    category: "Mobiles",
    base: 17999,
    desc: "Super AMOLED display, 6000mAh battery, 50MP OIS camera, IP67 rated.",
    specs: { Display: "6.6\" AMOLED", RAM: "6GB", Storage: "128GB", Battery: "6000mAh" },
    imgTag: "smartphone,android",
  },
  {
    title: "ASUS Vivobook 15 (i5, 16GB/512GB SSD)",
    brand: "ASUS",
    category: "Laptops",
    base: 54990,
    desc: "13th Gen Intel i5, 15.6-inch FHD display, Iris Xe graphics, backlit keyboard.",
    specs: { CPU: "Intel i5-1334U", RAM: "16GB", Storage: "512GB SSD", Display: "15.6\" FHD" },
    imgTag: "laptop,notebook",
  },
  {
    title: "HP Pavilion 14 (Ryzen 5, 16GB/512GB)",
    brand: "HP",
    category: "Laptops",
    base: 58990,
    desc: "AMD Ryzen 5 7530U, 14-inch WUXGA display, backlit keyboard, B&O audio.",
    specs: { CPU: "Ryzen 5 7530U", RAM: "16GB", Storage: "512GB SSD", Display: "14\" WUXGA" },
    imgTag: "laptop,computer",
  },
  {
    title: "Boat Rockerz 550 Wireless Headphones",
    brand: "boAt",
    category: "Electronics",
    base: 1799,
    desc: "50mm drivers, 20H playback, padded ear cushions, foldable design.",
    specs: { Type: "Over-ear", Battery: "20H", Bluetooth: "5.0" },
    imgTag: "headphones,wireless",
  },
  {
    title: "Noise ColorFit Pro 5 Smartwatch",
    brand: "Noise",
    category: "Electronics",
    base: 2299,
    desc: "1.85-inch AMOLED display, Bluetooth calling, 7-day battery life, SpO2 monitor.",
    specs: { Display: "1.85\" AMOLED", Battery: "7 days", Calling: "Bluetooth" },
    imgTag: "smartwatch,wearabletech",
  },
  {
    title: "Women's Cotton Kurti Set (Printed)",
    brand: "Libas",
    category: "Fashion",
    base: 899,
    desc: "Pure cotton fabric, printed design, comes with matching palazzo, festive wear.",
    specs: { Fabric: "Cotton", Fit: "Regular", Wash: "Machine wash" },
    imgTag: "indianfashion,kurti",
  },
  {
    title: "Men's Slim Fit Casual Shirt",
    brand: "Roadster",
    category: "Fashion",
    base: 699,
    desc: "100% cotton, checkered pattern, spread collar, full sleeves.",
    specs: { Fabric: "Cotton", Fit: "Slim", Sleeve: "Full" },
    imgTag: "mensshirt,mensfashion",
  },
  {
    title: "Prestige Electric Kettle 1.5L",
    brand: "Prestige",
    category: "Home & Kitchen",
    base: 899,
    desc: "1500W, auto shut-off, boil-dry protection, stainless steel body.",
    specs: { Capacity: "1.5L", Power: "1500W", Material: "Stainless Steel" },
    imgTag: "electrickettle,kitchenappliance",
  },
  {
    title: "Milton Thermosteel Water Bottle 1L",
    brand: "Milton",
    category: "Home & Kitchen",
    base: 649,
    desc: "24-hour hot/cold retention, leak-proof, double-wall vacuum insulation.",
    specs: { Capacity: "1L", Insulation: "Double wall vacuum" },
    imgTag: "waterbottle,steelbottle",
  },
  {
    title: "Mamaearth Vitamin C Face Serum 30ml",
    brand: "Mamaearth",
    category: "Beauty",
    base: 599,
    desc: "Brightening serum with Vitamin C & Turmeric, reduces dark spots, for all skin types.",
    specs: { Volume: "30ml", "Skin Type": "All" },
    imgTag: "skincare,serumbottle",
  },
  {
    title: "Campus Men's Running Shoes",
    brand: "Campus",
    category: "Footwear",
    base: 1299,
    desc: "Lightweight mesh upper, EVA sole, breathable and cushioned for daily runs.",
    specs: { Upper: "Mesh", Sole: "EVA", Closure: "Lace-up" },
    imgTag: "runningshoes,sneakers",
  },
  {
    title: "Fastrack Analog Wrist Watch (Men)",
    brand: "Fastrack",
    category: "Accessories",
    base: 1495,
    desc: "Stainless steel strap, water resistant, 2-year warranty, analog dial.",
    specs: { "Strap Material": "Stainless Steel", "Water Resistant": "Yes" },
    imgTag: "wristwatch,menswatch",
  },
  {
    title: "American Tourister Backpack 32L",
    brand: "American Tourister",
    category: "Accessories",
    base: 1199,
    desc: "Water-resistant fabric, padded laptop compartment, ergonomic straps.",
    specs: { Capacity: "32L", "Laptop Sleeve": "Yes" },
    imgTag: "backpack,travelbag",
  },
  {
    title: "Sony WH-CH520 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    base: 4490,
    desc: "Up to 50 hours battery, lightweight design, multipoint connection, quick charge.",
    specs: { Battery: "50H", Bluetooth: "5.2", Weight: "132g" },
    imgTag: "headphones,audiogear",
  },
  {
    title: "Women's Floral A-Line Dress",
    brand: "H&M",
    category: "Fashion",
    base: 1299,
    desc: "Lightweight rayon fabric, floral print, flared A-line silhouette, perfect for summer outings.",
    specs: { Fabric: "Rayon", Fit: "A-line", Sleeve: "Short" },
    imgTag: "womandress,summerdress",
  },
  {
    title: "Men's Slim Fit Denim Jeans",
    brand: "Levi's",
    category: "Fashion",
    base: 1999,
    desc: "Stretchable denim, slim fit, five-pocket styling, mid-rise waist.",
    specs: { Fabric: "Denim", Fit: "Slim", Rise: "Mid" },
    imgTag: "denimjeans,mensjeans",
  },
  {
    title: "Samsung 43-inch 4K Smart LED TV",
    brand: "Samsung",
    category: "Electronics",
    base: 32999,
    desc: "4K Ultra HD resolution, HDR10+, built-in Alexa, Crystal Display processor.",
    specs: { Resolution: "4K UHD", Size: "43 inch", Smart: "Tizen OS" },
    imgTag: "smarttv,television",
  },
  {
    title: "Apple iPhone 15 (128GB)",
    brand: "Apple",
    category: "Mobiles",
    base: 62999,
    desc: "6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera, USB-C.",
    specs: { Display: "6.1\" OLED", Chip: "A16 Bionic", Storage: "128GB" },
    imgTag: "iphone,applephone",
  },
  {
    title: "Women's Leather Handbag",
    brand: "Caprese",
    category: "Accessories",
    base: 1799,
    desc: "Genuine leather, spacious compartments, adjustable strap, everyday elegance.",
    specs: { Material: "Leather", Closure: "Zip", Strap: "Adjustable" },
    imgTag: "handbag,leatherbag",
  },
  {
    title: "Women's Casual Sneakers",
    brand: "Puma",
    category: "Footwear",
    base: 2499,
    desc: "Breathable knit upper, cushioned sole, lightweight design for all-day comfort.",
    specs: { Upper: "Knit", Sole: "Rubber", Closure: "Lace-up" },
    imgTag: "sneakers,womenshoes",
  },
  {
    title: "Dell Gaming Mouse + Keyboard Combo",
    brand: "Dell",
    category: "Electronics",
    base: 1899,
    desc: "RGB backlit keyboard, high-precision optical gaming mouse, plug-and-play USB.",
    specs: { Connectivity: "USB Wired", Backlight: "RGB" },
    imgTag: "gamingkeyboard,computermouse",
  },
];

// Additional catalog expansion — concise entries across every category so the
// demo catalog covers ~90 real, searchable products instead of just 23.
const moreProducts = [
  // Mobiles
  ["Xiaomi Redmi Note 13 Pro (8GB/256GB)", "Xiaomi", "Mobiles", 24999, "AMOLED display, 200MP camera, 120W fast charging.", { Display: "6.67\" AMOLED", Storage: "256GB" }, "smartphone,redmi"],
  ["Vivo V29 5G (8GB/128GB)", "Vivo", "Mobiles", 28999, "Curved AMOLED display, 50MP OIS portrait camera.", { Display: "6.78\" AMOLED", Storage: "128GB" }, "smartphone,vivo"],
  ["Realme 12 Pro+ 5G", "Realme", "Mobiles", 26999, "Periscope telephoto camera, curved display, Snapdragon chipset.", { Display: "6.7\" AMOLED", Storage: "256GB" }, "smartphone,realme"],
  ["Motorola Edge 40", "Motorola", "Mobiles", 23999, "pOLED curved display, MediaTek Dimensity, IP68 rated.", { Display: "6.55\" pOLED", Storage: "256GB" }, "smartphone,motorola"],
  ["iQOO Z9 5G", "iQOO", "Mobiles", 19999, "Snapdragon 7 Gen 3, 44W fast charging, 6000mAh battery.", { Battery: "6000mAh", Storage: "128GB" }, "smartphone,mobile"],
  ["Nothing Phone 2a", "Nothing", "Mobiles", 22999, "Unique Glyph interface, Dimensity 7200 Pro, 50MP dual camera.", { Display: "6.7\" AMOLED", Storage: "128GB" }, "smartphone,minimaldesign"],
  ["Google Pixel 8a", "Google", "Mobiles", 52999, "Tensor G3 chip, AI-powered camera, 7 years of OS updates.", { Chip: "Tensor G3", Storage: "128GB" }, "googlepixel,smartphone"],
  ["POCO X6 Pro 5G", "POCO", "Mobiles", 25999, "Dimensity 8300 Ultra, 6000 nits AMOLED, 67W turbo charge.", { Display: "6.67\" AMOLED", Storage: "256GB" }, "smartphone,poco"],
  ["OPPO Reno 11 5G", "OPPO", "Mobiles", 27999, "Portrait Expert camera, curved AMOLED display, sleek design.", { Display: "6.7\" AMOLED", Storage: "256GB" }, "smartphone,oppo"],
  ["Infinix Zero 30 5G", "Infinix", "Mobiles", 18999, "Curved display, 108MP OIS camera, 68W fast charging.", { Display: "6.78\" AMOLED", Storage: "256GB" }, "smartphone,infinix"],

  // Laptops
  ["Lenovo IdeaPad Slim 5 (Ryzen 7)", "Lenovo", "Laptops", 52990, "16GB RAM, 512GB SSD, 14-inch 2.2K display, backlit keyboard.", { CPU: "Ryzen 7", RAM: "16GB" }, "laptop,lenovo"],
  ["Acer Aspire 5 (i5, 8GB/512GB)", "Acer", "Laptops", 47990, "13th Gen Intel i5, 15.6-inch FHD IPS display, fast boot SSD.", { CPU: "Intel i5", RAM: "8GB" }, "laptop,acer"],
  ["Apple MacBook Air M2 (8GB/256GB)", "Apple", "Laptops", 92990, "M2 chip, 13.6-inch Liquid Retina display, 18-hour battery life.", { Chip: "Apple M2", Storage: "256GB" }, "macbook,applelaptop"],
  ["MSI Modern 14 (i5, 16GB/512GB)", "MSI", "Laptops", 49990, "Slim design, 14-inch FHD display, fast-charging battery.", { CPU: "Intel i5", RAM: "16GB" }, "laptop,msi"],
  ["Dell Inspiron 15 (i3, 8GB/512GB)", "Dell", "Laptops", 39990, "15.6-inch FHD display, reliable everyday performance.", { CPU: "Intel i3", RAM: "8GB" }, "laptop,dell"],
  ["Mi Notebook Ultra (i5, 16GB/512GB)", "Xiaomi", "Laptops", 41990, "3.2K display, 100% sRGB, aluminium unibody design.", { CPU: "Intel i5", Display: "14\" 3.2K" }, "laptop,notebook"],
  ["Lenovo Legion 5 Gaming Laptop", "Lenovo", "Laptops", 84990, "RTX 4060, Ryzen 7, 165Hz display, RGB backlit keyboard.", { GPU: "RTX 4060", RAM: "16GB" }, "gaminglaptop,rgbkeyboard"],
  ["HP Victus Gaming Laptop", "HP", "Laptops", 64990, "RTX 3050, i5 13th Gen, 144Hz FHD display for smooth gaming.", { GPU: "RTX 3050", RAM: "16GB" }, "gaminglaptop,hp"],

  // Fashion
  ["Women's Banarasi Silk Saree", "Sudarshan Silk", "Fashion", 2499, "Traditional Banarasi weave, rich pallu, comes with blouse piece.", { Fabric: "Silk", Occasion: "Festive" }, "saree,indiansilk"],
  ["Men's Formal Blazer (Slim Fit)", "Van Heusen", "Fashion", 2999, "Wrinkle-resistant fabric, notch lapel, office & party wear.", { Fabric: "Polyester Blend", Fit: "Slim" }, "blazer,mensformal"],
  ["Women's Printed Palazzo Set", "Biba", "Fashion", 1099, "Comfortable rayon palazzo with matching printed kurta.", { Fabric: "Rayon", Fit: "Relaxed" }, "palazzo,indianwear"],
  ["Men's Jogger Track Pants", "HRX", "Fashion", 799, "4-way stretch fabric, zipper pockets, ideal for workouts.", { Fabric: "Polyester", Fit: "Jogger" }, "trackpants,sportswear"],
  ["Women's Ribbed Crop Top", "Only", "Fashion", 599, "Soft ribbed fabric, round neck, perfect casual layering piece.", { Fabric: "Cotton Blend", Fit: "Regular" }, "croptop,womenfashion"],
  ["Men's Fleece Hoodie", "Adidas", "Fashion", 1299, "Warm fleece lining, kangaroo pocket, drawstring hood.", { Fabric: "Fleece", Fit: "Regular" }, "hoodie,mensfashion"],
  ["Women's Ethnic Anarkali Suit", "W for Woman", "Fashion", 1899, "Flowy Anarkali silhouette with dupatta, festive embroidery.", { Fabric: "Georgette", Occasion: "Festive" }, "anarkali,ethnicwear"],
  ["Men's Polo T-Shirt (Pack of 2)", "US Polo", "Fashion", 799, "Pique cotton fabric, ribbed collar, classic polo fit.", { Fabric: "Cotton", Fit: "Regular" }, "poloshirt,mensfashion"],
  ["Women's Oversized Denim Jacket", "ONLY", "Fashion", 1799, "Washed denim, oversized fit, button-front closure.", { Fabric: "Denim", Fit: "Oversized" }, "denimjacket,womenfashion"],
  ["Kids Cartoon Print Cotton T-Shirt", "H&M Kids", "Fashion", 399, "Soft cotton, fun cartoon print, machine washable.", { Fabric: "Cotton", Age: "4-8 yrs" }, "kidsclothing,tshirt"],

  // Footwear
  ["Men's Formal Leather Shoes", "Bata", "Footwear", 2199, "Genuine leather upper, cushioned insole, office formal wear.", { Material: "Leather", Sole: "TPR" }, "formalshoes,leathershoes"],
  ["Women's Flat Comfort Sandals", "Metro", "Footwear", 899, "Soft footbed, anti-skid sole, everyday comfort sandals.", { Material: "Synthetic", Sole: "Rubber" }, "sandals,womenfootwear"],
  ["Men's Sports Sandals", "Sparx", "Footwear", 999, "Adjustable straps, shock-absorbing sole, all-terrain grip.", { Material: "EVA", Closure: "Velcro" }, "sportsandals,mensfootwear"],
  ["Women's Block Heel Sandals", "Catwalk", "Footwear", 1599, "Comfortable block heel, party wear design, ankle strap.", { HeelHeight: "2 inch", Material: "Synthetic" }, "heels,womenshoes"],
  ["Kids Velcro Sports Shoes", "Campus Kids", "Footwear", 799, "Lightweight, easy velcro closure, durable outsole.", { Closure: "Velcro", Age: "3-10 yrs" }, "kidsshoes,sneakers"],
  ["Men's Casual Loafers", "Red Tape", "Footwear", 1699, "Slip-on design, cushioned footbed, smart-casual style.", { Material: "Leather", Closure: "Slip-on" }, "loafers,mensfootwear"],
  ["Women's Ankle Length Boots", "Delize", "Footwear", 2299, "Zip closure, block heel, faux-suede finish for winters.", { Material: "Faux Suede", HeelHeight: "2 inch" }, "ankleboots,womenfootwear"],

  // Electronics
  ["JBL Go 3 Bluetooth Speaker", "JBL", "Electronics", 2499, "Portable design, punchy bass, IP67 dust & water resistant.", { Battery: "5H", Bluetooth: "5.1" }, "bluetoothspeaker,portablespeaker"],
  ["Mi Power Bank 3i 20000mAh", "Xiaomi", "Electronics", 1499, "Dual USB output, 18W fast charging, triple-layer protection.", { Capacity: "20000mAh", Output: "18W" }, "powerbank,charger"],
  ["Samsung Galaxy Tab A9", "Samsung", "Electronics", 15999, "8.7-inch display, quad speakers, great for kids' e-learning.", { Display: "8.7 inch", Storage: "64GB" }, "tablet,androidtablet"],
  ["Canon EOS 1500D DSLR Camera", "Canon", "Electronics", 42999, "24.1MP sensor, Full HD video, beginner-friendly DSLR.", { Sensor: "24.1MP", Video: "Full HD" }, "dslrcamera,photography"],
  ["HP DeskJet All-in-One Printer", "HP", "Electronics", 4999, "Print, scan, copy — compact design for home & small office.", { Type: "Inkjet", Functions: "Print/Scan/Copy" }, "printer,officeprinter"],
  ["TP-Link Archer WiFi Router", "TP-Link", "Electronics", 1699, "Dual-band WiFi, wide coverage, easy setup via app.", { Bands: "Dual-band", Speed: "1200Mbps" }, "wifirouter,networking"],
  ["Sony DualSense PS5 Controller", "Sony", "Electronics", 5499, "Haptic feedback, adaptive triggers, built-in microphone.", { Compatibility: "PS5", Battery: "12H" }, "gamecontroller,playstation"],
  ["Amazon Echo Dot (5th Gen)", "Amazon", "Electronics", 3499, "Alexa built-in, improved bass, smart home control hub.", { Assistant: "Alexa", Connectivity: "WiFi/BT" }, "smartspeaker,alexa"],
  ["Realme Buds T300 Wireless Earbuds", "Realme", "Electronics", 1799, "ANC up to 40dB, 40-hour battery with case, low latency.", { ANC: "40dB", Battery: "40H total" }, "earbuds,truewireless"],
  ["Apple AirPods Pro (2nd Gen)", "Apple", "Electronics", 19999, "Active Noise Cancellation, Adaptive Audio, USB-C case.", { ANC: "Yes", Chip: "H2" }, "airpods,applewireless"],

  // Beauty
  ["Lakme 9 to 5 Matte Lipstick", "Lakme", "Beauty", 399, "Long-lasting matte finish, lightweight formula, rich pigment.", { Finish: "Matte", Volume: "3.6g" }, "lipstick,cosmetics"],
  ["Nivea Soft Light Body Lotion", "Nivea", "Beauty", 299, "Non-greasy, fast-absorbing, 48-hour hydration for all skin types.", { Volume: "400ml", SkinType: "All" }, "bodylotion,skincare"],
  ["L'Oreal Paris Total Repair Shampoo", "L'Oreal", "Beauty", 349, "Repairs damaged hair, ceramide formula, salon-like shine.", { Volume: "340ml", HairType: "Damaged" }, "shampoo,haircare"],
  ["Neutrogena Ultra Sheer Sunscreen SPF50", "Neutrogena", "Beauty", 549, "Lightweight, non-greasy, broad spectrum UVA/UVB protection.", { SPF: "50+", Volume: "88ml" }, "sunscreen,skincare"],
  ["Fogg Fresh Deodorant Spray", "Fogg", "Beauty", 249, "Long-lasting fragrance, no-gas high concentration formula.", { Volume: "150ml", Type: "Deodorant" }, "deodorant,fragrance"],
  ["WOW Skin Science Aloe Vera Gel", "WOW", "Beauty", 299, "99% pure aloe vera, soothing gel for skin and hair.", { Volume: "200ml", SkinType: "All" }, "aloeveragel,skincare"],
  ["Maybelline Colossal Kajal", "Maybelline", "Beauty", 199, "Intense black pigment, smudge-proof, 12-hour stay formula.", { Shade: "Black", Volume: "0.35g" }, "kajal,eyemakeup"],

  // Home & Kitchen
  ["Philips Mixer Grinder 750W", "Philips", "Home & Kitchen", 2999, "3 stainless steel jars, powerful motor, overload protection.", { Power: "750W", Jars: "3" }, "mixergrinder,kitchenappliance"],
  ["Bajaj Majesty Air Fryer 4L", "Bajaj", "Home & Kitchen", 5999, "Oil-free frying, digital touch panel, 4L capacity for families.", { Capacity: "4L", Power: "1400W" }, "airfryer,kitchenappliance"],
  ["Prestige Induction Cooktop", "Prestige", "Home & Kitchen", 1999, "Auto shut-off, Indian menu presets, sleek glass top.", { Power: "1900W", Type: "Induction" }, "inductioncooktop,kitchen"],
  ["Non-Stick Cookware Set (5pc)", "Wonderchef", "Home & Kitchen", 1899, "PFOA-free coating, induction friendly, includes lids.", { Pieces: "5", Coating: "Non-stick" }, "cookwareset,kitchen"],
  ["Cotton King Size Bedsheet Set", "Bombay Dyeing", "Home & Kitchen", 899, "100% cotton, includes 2 pillow covers, breathable fabric.", { Fabric: "Cotton", Size: "King" }, "bedsheet,homedecor"],
  ["Modern Wall Clock (Silent Sweep)", "Ajanta", "Home & Kitchen", 599, "Noiseless movement, minimalist design, easy wall mount.", { Movement: "Silent Sweep", Diameter: "12 inch" }, "wallclock,homedecor"],
  ["LED Study Table Lamp", "Wipro", "Home & Kitchen", 799, "Adjustable brightness, flicker-free LED, foldable arm.", { LightSource: "LED", Modes: "3" }, "tablelamp,homedecor"],
  ["Storage Organizer Box Set (3pc)", "Cello", "Home & Kitchen", 699, "Stackable design, clear lid, great for wardrobe organizing.", { Pieces: "3", Material: "Plastic" }, "storagebox,homeorganizer"],

  // Accessories
  ["Ray-Ban Classic Aviator Sunglasses", "Ray-Ban", "Accessories", 3999, "UV-protected lenses, metal frame, timeless aviator style.", { LensProtection: "UV400", Frame: "Metal" }, "sunglasses,aviator"],
  ["Men's Genuine Leather Wallet", "WildHorn", "Accessories", 599, "RFID protected, multiple card slots, genuine leather finish.", { Material: "Leather", Protection: "RFID" }, "leatherwallet,mensaccessory"],
  ["Titan Raga Women's Watch", "Titan", "Accessories", 2299, "Elegant dial, stainless steel strap, water resistant.", { Strap: "Stainless Steel", WaterResistant: "Yes" }, "womenswatch,titan"],
  ["Fossil Men's Leather Belt", "Fossil", "Accessories", 899, "Genuine leather, reversible buckle, formal & casual use.", { Material: "Leather", Closure: "Buckle" }, "leatherbelt,mensaccessory"],
  ["Silver Plated Jewelry Set", "Zaveri Pearls", "Accessories", 1299, "Necklace + earrings set, elegant design for festive occasions.", { Material: "Silver Plated", Occasion: "Festive" }, "jewelryset,fashionjewelry"],
  ["Transparent Phone Back Case Cover", "Spigen", "Accessories", 299, "Shockproof corners, scratch-resistant, slim fit design.", { Material: "TPU", Protection: "Shockproof" }, "phonecase,mobileaccessory"],
  ["Skybags Laptop Backpack", "Skybags", "Accessories", 1499, "Padded laptop compartment, water-resistant fabric, USB port.", { Capacity: "30L", LaptopSleeve: "Yes" }, "laptopbag,officebag"],
];

moreProducts.forEach(([title, brand, category, base, desc, specs, imgTag]) => {
  rawProducts.push({ title, brand, category, base, desc, specs, imgTag });
});

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const seed = async () => {
  await connectDB();
  console.log("Clearing existing data...");
  await Product.deleteMany();
  await User.deleteMany();

  console.log("Creating admin + demo user...");
  await User.create({
    name: "Admin",
    email: "admin@priceradar.com",
    password: "admin123",
    role: "admin",
  });
  await User.create({
    name: "Demo User",
    email: "demo@priceradar.com",
    password: "demo1234",
    role: "user",
  });

  if (PEXELS_API_KEY) {
    console.log("PEXELS_API_KEY found — fetching real matching photos from Pexels...");
  } else {
    console.log("No PEXELS_API_KEY set — using Picsum Photos fallback (reliable, but not keyword-matched).");
    console.log("(Get a free key in ~1 min at https://www.pexels.com/api/ and add it to .env for relevant real images.)");
  }

  console.log(`Seeding ${rawProducts.length} products with multi-platform prices...`);
  let i = 0;
  for (const p of rawProducts) {
    i++;
    const slug = slugify(p.title);
    const pp = platforms(p.base);
    const history = genHistory(p.base, pp.map((x) => x.platform));
    const images = await getProductImages(p);

    const product = new Product({
      title: p.title,
      slug,
      brand: p.brand,
      category: p.category,
      description: p.desc,
      images,
      specs: p.specs,
      ourStock: Math.floor(Math.random() * 40) + 10,
      platformPrices: pp,
      priceHistory: history,
      tags: [p.brand, p.category],
      avgRating: Math.round((3.7 + Math.random() * 1.3) * 10) / 10,
      numReviews: Math.floor(Math.random() * 120) + 5,
    });
    product.recomputePriceStats();
    await product.save();
    console.log(`  [${i}/${rawProducts.length}] ${p.title}`);
  }

  console.log(`Seeded ${rawProducts.length} products successfully.`);
  console.log("Admin login: admin@priceradar.com / admin123");
  console.log("Demo login: demo@priceradar.com / demo1234");
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
