require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  // =====================================================
  // MOBILES - 4 PRODUCTS
  // =====================================================

  {
    title: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    brand: "Samsung",
    category: "Mobiles",
    description:
      "Flagship smartphone with excellent performance, display and camera.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
    ],
    specs: {
      RAM: "8GB",
      Storage: "256GB",
      Display: "6.2 inch",
    },
    ourStock: 20,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 69999,
        originalPrice: 74999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 68999,
        originalPrice: 74999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 67999,
        originalPrice: 74999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.7,
    numReviews: 125,
    tags: ["samsung", "smartphone", "android"],
  },

  {
    title: "Apple iPhone 15",
    slug: "apple-iphone-15",
    brand: "Apple",
    category: "Mobiles",
    description:
      "Apple iPhone with powerful performance and premium design.",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    ],
    specs: {
      RAM: "6GB",
      Storage: "128GB",
      Display: "6.1 inch",
    },
    ourStock: 15,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 64999,
        originalPrice: 69999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 63999,
        originalPrice: 69999,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 62999,
        originalPrice: 69999,
        url: "#",
        rating: 4.8,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.8,
    numReviews: 240,
    tags: ["iphone", "apple", "smartphone"],
  },

  {
    title: "OnePlus 12",
    slug: "oneplus-12",
    brand: "OnePlus",
    category: "Mobiles",
    description:
      "Premium Android smartphone with powerful processor and high refresh rate display.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
    ],
    specs: {
      RAM: "12GB",
      Storage: "256GB",
      Display: "6.82 inch",
    },
    ourStock: 18,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 59999,
        originalPrice: 64999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 58999,
        originalPrice: 64999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 57999,
        originalPrice: 64999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 178,
    tags: ["oneplus", "android", "smartphone"],
  },

  {
    title: "Google Pixel 8",
    slug: "google-pixel-8",
    brand: "Google",  
    category: "Mobiles",
    description:
      "Google smartphone with excellent camera and clean Android experience.",
    images: [
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop"
],
    specs: {
      RAM: "8GB",
      Storage: "128GB",
      Display: "6.2 inch",
    },
    ourStock: 14,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 52999,
        originalPrice: 59999,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 51999,
        originalPrice: 59999,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 50999,
        originalPrice: 59999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 143,
    tags: ["google", "pixel", "android", "camera"],
  },

  // =====================================================
  // LAPTOPS - 4 PRODUCTS
  // =====================================================

  {
    title: "HP Pavilion 15 Laptop",
    slug: "hp-pavilion-15",
    brand: "HP",
    category: "Laptops",
    description:
      "Powerful laptop suitable for students and professionals.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],
    specs: {
      RAM: "16GB",
      Storage: "512GB SSD",
      Processor: "Intel Core i5",
    },
    ourStock: 10,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 62999,
        originalPrice: 69999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 61999,
        originalPrice: 69999,
        url: "#",
        rating: 4.4,
        deliveryDays: 4,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 60999,
        originalPrice: 69999,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 89,
    tags: ["laptop", "hp", "student"],
  },

  {
    title: "Dell Inspiron 15",
    slug: "dell-inspiron-15",
    brand: "Dell",
    category: "Laptops",
    description:
      "Reliable everyday laptop for work, study and entertainment.",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800",
    ],
    specs: {
      RAM: "16GB",
      Storage: "512GB SSD",
      Processor: "Intel Core i5",
    },
    ourStock: 12,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 65999,
        originalPrice: 72999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 64999,
        originalPrice: 72999,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 63999,
        originalPrice: 72999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 112,
    tags: ["dell", "laptop", "office"],
  },

  {
    title: "Lenovo IdeaPad Slim 3",
    slug: "lenovo-ideapad-slim-3",
    brand: "Lenovo",
    category: "Laptops",
    description:
      "Slim and lightweight laptop designed for everyday productivity.",
    images: [
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800",
    ],
    specs: {
      RAM: "8GB",
      Storage: "512GB SSD",
      Processor: "AMD Ryzen 5",
    },
    ourStock: 16,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 48999,
        originalPrice: 55999,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 47999,
        originalPrice: 55999,
        url: "#",
        rating: 4.3,
        deliveryDays: 4,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 46999,
        originalPrice: 55999,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.4,
    numReviews: 96,
    tags: ["lenovo", "laptop", "student"],
  },

  {
    title: "Apple MacBook Air M2",
    slug: "apple-macbook-air-m2",
    brand: "Apple",
    category: "Laptops",
    description:
      "Thin and powerful MacBook Air with Apple M2 chip.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],
    specs: {
      RAM: "8GB",
      Storage: "256GB SSD",
      Processor: "Apple M2",
    },
    ourStock: 8,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 89999,
        originalPrice: 99999,
        url: "#",
        rating: 4.8,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 88999,
        originalPrice: 99999,
        url: "#",
        rating: 4.7,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "PriceRadar",
        price: 87999,
        originalPrice: 99999,
        url: "#",
        rating: 4.8,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.8,
    numReviews: 204,
    tags: ["apple", "macbook", "laptop"],
  },

  // =====================================================
  // FASHION - 4 PRODUCTS
  // =====================================================

  {
    title: "Women's Silk Saree",
    slug: "womens-silk-saree",
    brand: "Fashion",
    category: "Fashion",
    description:
      "Elegant silk saree for festive and traditional occasions.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
    ],
    specs: {
      Material: "Silk",
      Type: "Traditional Saree",
    },
    ourStock: 18,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1899,
        originalPrice: 2499,
        url: "#",
        rating: 4.5,
        deliveryDays: 4,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 1799,
        originalPrice: 2499,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 98,
    tags: ["saree", "silk", "fashion"],
  },

  {
    title: "Men's Casual Cotton Shirt",
    slug: "mens-casual-cotton-shirt",
    brand: "Fashion",
    category: "Fashion",
    description:
      "Comfortable cotton casual shirt suitable for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
    ],
    specs: {
      Material: "Cotton",
      Fit: "Regular Fit",
      Sizes: "M-XXL",
    },
    ourStock: 25,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 899,
        originalPrice: 1299,
        url: "#",
        rating: 4.3,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 799,
        originalPrice: 1299,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Ajio",
        price: 849,
        originalPrice: 1299,
        url: "#",
        rating: 4.4,
        deliveryDays: 4,
        inStock: true,
      },
    ],
    avgRating: 4.4,
    numReviews: 76,
    tags: ["shirt", "men", "cotton", "fashion"],
  },

  {
    title: "Women's Denim Jacket",
    slug: "womens-denim-jacket",
    brand: "Fashion",
    category: "Fashion",
    description:
      "Stylish denim jacket perfect for casual outfits.",
    images: [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800",
    ],
    specs: {
      Material: "Denim",
      Fit: "Regular",
      Sizes: "S-XL",
    },
    ourStock: 20,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1599,
        originalPrice: 2299,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 1499,
        originalPrice: 2299,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 84,
    tags: ["jacket", "denim", "women"],
  },

  {
    title: "Men's Classic Hoodie",
    slug: "mens-classic-hoodie",
    brand: "Fashion",
    category: "Fashion",
    description:
      "Warm and comfortable hoodie for casual everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
    ],
    specs: {
      Material: "Cotton Blend",
      Fit: "Regular",
      Sizes: "M-XXL",
    },
    ourStock: 22,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1199,
        originalPrice: 1799,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 1099,
        originalPrice: 1799,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 91,
    tags: ["hoodie", "men", "winter", "fashion"],
  },

  // =====================================================
  // HOME & KITCHEN - 4 PRODUCTS
  // =====================================================

  {
    title: "Milton Thermosteel Water Bottle",
    slug: "milton-thermosteel-water-bottle",
    brand: "Milton",
    category: "Home & Kitchen",
    description:
      "Stainless steel insulated water bottle.",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    ],
    specs: {
      Capacity: "1 Litre",
      Material: "Stainless Steel",
      Type: "Insulated",
    },
    ourStock: 30,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 799,
        originalPrice: 999,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 749,
        originalPrice: 999,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 72,
    tags: ["water bottle", "milton", "kitchen"],
  },

  {
    title: "Prestige Electric Kettle",
    slug: "prestige-electric-kettle",
    brand: "Prestige",
    category: "Home & Kitchen",
    description:
      "Fast boiling electric kettle for tea, coffee and hot water.",
    images: [
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800",
    ],
    specs: {
      Capacity: "1.5 Litre",
      Power: "1500W",
      Material: "Stainless Steel",
    },
    ourStock: 24,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1299,
        originalPrice: 1699,
        url: "#",
        rating: 4.4,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 1199,
        originalPrice: 1699,
        url: "#",
        rating: 4.3,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.4,
    numReviews: 113,
    tags: ["kettle", "prestige", "kitchen"],
  },

  {
    title: "Borosil Glass Dinner Set",
    slug: "borosil-glass-dinner-set",
    brand: "Borosil",
    category: "Home & Kitchen",
    description:
      "Elegant glass dinner set for everyday and special occasions.",
    images: [
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800",
    ],
    specs: {
      Pieces: "18 Pieces",
      Material: "Glass",
      Type: "Dinner Set",
    },
    ourStock: 12,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1999,
        originalPrice: 2499,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 1899,
        originalPrice: 2499,
        url: "#",
        rating: 4.4,
        deliveryDays: 4,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 65,
    tags: ["borosil", "dinner set", "kitchen"],
  },

  {
    title: "Pigeon Non Stick Cookware Set",
    slug: "pigeon-non-stick-cookware-set",
    brand: "Pigeon",
    category: "Home & Kitchen",
    description:
      "Useful non-stick cookware set for everyday cooking.",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
    ],
    specs: {
      Pieces: "3 Pieces",
      Material: "Non Stick",
      Type: "Cookware",
    },
    ourStock: 15,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1699,
        originalPrice: 2299,
        url: "#",
        rating: 4.3,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 1599,
        originalPrice: 2299,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.4,
    numReviews: 87,
    tags: ["pigeon", "cookware", "kitchen"],
  },

  // =====================================================
  // ELECTRONICS - 4 PRODUCTS
  // =====================================================

  {
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    brand: "Sony",
    category: "Electronics",
    description:
      "Premium wireless noise cancelling headphones.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    ],
    specs: {
      Type: "Wireless",
      Connectivity: "Bluetooth",
      Battery: "30 Hours",
    },
    ourStock: 12,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 24999,
        originalPrice: 29999,
        url: "#",
        rating: 4.8,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 23999,
        originalPrice: 29999,
        url: "#",
        rating: 4.7,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.8,
    numReviews: 210,
    tags: ["sony", "headphones", "wireless"],
  },

  {
    title: "JBL Bluetooth Speaker",
    slug: "jbl-bluetooth-speaker",
    brand: "JBL",
    category: "Electronics",
    description:
      "Portable Bluetooth speaker with powerful sound.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    ],
    specs: {
      Type: "Portable Speaker",
      Connectivity: "Bluetooth",
      Battery: "12 Hours",
    },
    ourStock: 20,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 3499,
        originalPrice: 4499,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 3399,
        originalPrice: 4499,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 154,
    tags: ["jbl", "speaker", "bluetooth"],
  },

  {
    title: "Logitech Wireless Mouse",
    slug: "logitech-wireless-mouse",
    brand: "Logitech",
    category: "Electronics",
    description:
      "Comfortable wireless mouse for laptop and desktop use.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ],
    specs: {
      Connectivity: "Wireless",
      DPI: "1000 DPI",
      Battery: "18 Months",
    },
    ourStock: 35,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 799,
        originalPrice: 999,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 749,
        originalPrice: 999,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 132,
    tags: ["logitech", "mouse", "wireless"],
  },

  {
    title: "Apple AirPods Pro",
    slug: "apple-airpods-pro",
    brand: "Apple",
    category: "Electronics",
    description:
      "Premium wireless earbuds with active noise cancellation.",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
    ],
    specs: {
      Type: "Wireless Earbuds",
      Connectivity: "Bluetooth",
      Battery: "24 Hours",
    },
    ourStock: 10,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 19999,
        originalPrice: 24999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 19499,
        originalPrice: 24999,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.7,
    numReviews: 189,
    tags: ["apple", "airpods", "earbuds"],
  },

  // =====================================================
  // BEAUTY - 4 PRODUCTS
  // =====================================================

  {
    title: "Lakme Face Cream",
    slug: "lakme-face-cream",
    brand: "Lakme",
    category: "Beauty",
    description: "Daily skincare face cream.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    ],
    specs: {
      Quantity: "50g",
      Type: "Face Cream",
    },
    ourStock: 40,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 399,
        originalPrice: 499,
        url: "#",
        rating: 4.3,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Meesho",
        price: 349,
        originalPrice: 499,
        url: "#",
        rating: 4.2,
        deliveryDays: 4,
        inStock: true,
      },
    ],
    avgRating: 4.3,
    numReviews: 54,
    tags: ["beauty", "lakme", "skincare"],
  },

  {
    title: "Maybelline Matte Lipstick",
    slug: "maybelline-matte-lipstick",
    brand: "Maybelline",
    category: "Beauty",
    description:
      "Long lasting matte lipstick with rich color.",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
    ],
    specs: {
      Type: "Matte Lipstick",
      Quantity: "3.5g",
      Finish: "Matte",
    },
    ourStock: 35,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 499,
        originalPrice: 699,
        url: "#",
        rating: 4.4,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 449,
        originalPrice: 699,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Meesho",
        price: 429,
        originalPrice: 699,
        url: "#",
        rating: 4.2,
        deliveryDays: 4,
        inStock: true,
      },
    ],
    avgRating: 4.4,
    numReviews: 121,
    tags: ["maybelline", "lipstick", "makeup"],
  },

  {
    title: "Nivea Body Lotion",
    slug: "nivea-body-lotion",
    brand: "Nivea",
    category: "Beauty",
    description:
      "Moisturizing body lotion for soft and smooth skin.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    ],
    specs: {
      Quantity: "400ml",
      Type: "Body Lotion",
      SkinType: "All Skin Types",
    },
    ourStock: 28,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 499,
        originalPrice: 649,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 479,
        originalPrice: 649,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 105,
    tags: ["nivea", "body lotion", "skincare"],
  },

  {
    title: "Mamaearth Face Wash",
    slug: "mamaearth-face-wash",
    brand: "Mamaearth",
    category: "Beauty",
    description:
      "Gentle face wash for everyday skincare.",
    images: [
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=800",
    ],
    specs: {
      Quantity: "100ml",
      Type: "Face Wash",
      SkinType: "All Skin Types",
    },
    ourStock: 32,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 399,
        originalPrice: 499,
        url: "#",
        rating: 4.3,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Meesho",
        price: 349,
        originalPrice: 499,
        url: "#",
        rating: 4.2,
        deliveryDays: 4,
        inStock: true,
      },
    ],
    avgRating: 4.3,
    numReviews: 88,
    tags: ["mamaearth", "face wash", "skincare"],
  },

  // =====================================================
  // FOOTWEAR - 4 PRODUCTS
  // =====================================================

  {
    title: "Nike Air Max Running Shoes",
    slug: "nike-air-max-running-shoes",
    brand: "Nike",
    category: "Footwear",
    description:
      "Comfortable running shoes with modern design.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    specs: {
      Size: "7-12",
      Type: "Running Shoes",
      Material: "Mesh",
    },
    ourStock: 25,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 4999,
        originalPrice: 6999,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 4599,
        originalPrice: 6999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.7,
    numReviews: 156,
    tags: ["nike", "shoes", "running"],
  },

  {
    title: "Adidas Sports Shoes",
    slug: "adidas-sports-shoes",
    brand: "Adidas",
    category: "Footwear",
    description:
      "Lightweight sports shoes designed for active lifestyles.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    ],
    specs: {
      Size: "7-11",
      Type: "Sports Shoes",
      Material: "Mesh",
    },
    ourStock: 20,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 3999,
        originalPrice: 5999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 3799,
        originalPrice: 5999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 134,
    tags: ["adidas", "sports", "shoes"],
  },

  {
    title: "Puma Casual Sneakers",
    slug: "puma-casual-sneakers",
    brand: "Puma",
    category: "Footwear",
    description:
      "Stylish casual sneakers for everyday outfits.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    ],
    specs: {
      Size: "7-12",
      Type: "Sneakers",
      Material: "Synthetic",
    },
    ourStock: 18,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 2999,
        originalPrice: 4499,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 2799,
        originalPrice: 4499,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 118,
    tags: ["puma", "sneakers", "shoes"],
  },

  {
    title: "Skechers Walking Shoes",
    slug: "skechers-walking-shoes",
    brand: "Skechers",
    category: "Footwear",
    description:
      "Comfortable walking shoes with cushioned sole.",
    images: [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
],
    specs: {
      Size: "7-11",
      Type: "Walking Shoes",
      Material: "Mesh",
    },
    ourStock: 16,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 4499,
        originalPrice: 5999,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 4299,
        originalPrice: 5999,
        url: "#",
        rating: 4.7,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 145,
    tags: ["skechers", "walking", "shoes"],
  },

  // =====================================================
  // ACCESSORIES - 4 PRODUCTS
  // =====================================================

  {
    title: "Fossil Leather Wallet",
    slug: "fossil-leather-wallet",
    brand: "Fossil",
    category: "Accessories",
    description:
      "Premium leather wallet with multiple card slots.",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    ],
    specs: {
      Material: "Genuine Leather",
      Type: "Wallet",
      Slots: "8 Card Slots",
    },
    ourStock: 15,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1999,
        originalPrice: 2999,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 1899,
        originalPrice: 2999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 73,
    tags: ["fossil", "wallet", "leather"],
  },

  {
    title: "American Tourister Backpack",
    slug: "american-tourister-backpack",
    brand: "American Tourister",
    category: "Accessories",
    description:
      "Spacious backpack suitable for college, office and travel.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    ],
    specs: {
      Capacity: "30 Litres",
      Material: "Polyester",
      Compartments: "3",
    },
    ourStock: 20,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 1699,
        originalPrice: 2499,
        url: "#",
        rating: 4.5,
        deliveryDays: 2,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 1599,
        originalPrice: 2499,
        url: "#",
        rating: 4.4,
        deliveryDays: 3,
        inStock: true,
      },
    ],
    avgRating: 4.5,
    numReviews: 124,
    tags: ["backpack", "travel", "college"],
  },

  {
    title: "Titan Analog Watch",
    slug: "titan-analog-watch",
    brand: "Titan",
    category: "Accessories",
    description:
      "Classic analog watch with elegant design.",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
    ],
    specs: {
      Type: "Analog Watch",
      Strap: "Leather",
      Movement: "Quartz",
    },
    ourStock: 12,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 2499,
        originalPrice: 3299,
        url: "#",
        rating: 4.6,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Flipkart",
        price: 2399,
        originalPrice: 3299,
        url: "#",
        rating: 4.5,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 2299,
        originalPrice: 3299,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.6,
    numReviews: 92,
    tags: ["titan", "watch", "accessories"],
  },

  {
    title: "Ray-Ban Classic Sunglasses",
    slug: "ray-ban-classic-sunglasses",
    brand: "Ray-Ban",
    category: "Accessories",
    description:
      "Classic sunglasses with timeless design.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    ],
    specs: {
      Type: "Sunglasses",
      Lens: "UV Protected",
      Frame: "Classic",
    },
    ourStock: 10,
    isOwnListing: true,
    platformPrices: [
      {
        platform: "Amazon",
        price: 6999,
        originalPrice: 8999,
        url: "#",
        rating: 4.7,
        deliveryDays: 3,
        inStock: true,
      },
      {
        platform: "Myntra",
        price: 6799,
        originalPrice: 8999,
        url: "#",
        rating: 4.6,
        deliveryDays: 2,
        inStock: true,
      },
    ],
    avgRating: 4.7,
    numReviews: 108,
    tags: ["rayban", "sunglasses", "accessories"],
  },
];

// =====================================================
// SEED DATABASE
// =====================================================

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old products
    await Product.deleteMany({});

    // Calculate lowest and highest prices automatically
    for (const product of products) {
      const prices = product.platformPrices || [];

      if (prices.length > 0) {
        const inStockPrices = prices.filter(
          (p) => p.inStock !== false
        );

        const list = inStockPrices.length
          ? inStockPrices
          : prices;

        const lowest = list.reduce((a, b) =>
          a.price < b.price ? a : b
        );

        const highest = list.reduce((a, b) =>
          a.price > b.price ? a : b
        );

        product.lowestPrice = lowest.price;
        product.lowestPricePlatform = lowest.platform;
        product.highestPrice = highest.price;
      }
    }

    await Product.insertMany(products);

    console.log(
      `${products.length} products inserted successfully`
    );

    // Category count
    const categoryCounts = {};

    products.forEach((product) => {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    });

    console.log("\nCategory Summary:");

    Object.entries(categoryCounts).forEach(
      ([category, count]) => {
        console.log(`${category}: ${count}`);
      }
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedProducts();