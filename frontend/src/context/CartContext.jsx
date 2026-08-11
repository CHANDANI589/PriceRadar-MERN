import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();
const STORAGE_KEY = "priceradar_cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, platform = "PriceRadar", price) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id && item.platform === platform
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id && item.platform === platform
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          slug: product.slug,
          title: product.title,
          image: product.images?.[0],
          price,
          platform,
          qty: 1,
        },
      ];
    });
    toast.success(`${product.title.slice(0, 30)}... added to cart`);
  };

  const removeFromCart = (productId, platform) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.platform === platform)));
  };

  const updateQty = (productId, platform, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.productId === productId && i.platform === platform ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
