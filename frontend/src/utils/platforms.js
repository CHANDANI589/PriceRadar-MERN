export const PLATFORM_STYLES = {
  Amazon: { color: "#FF9900", text: "#131921", label: "Amazon" },
  Flipkart: { color: "#2874F0", text: "#ffffff", label: "Flipkart" },
  Meesho: { color: "#9F2089", text: "#ffffff", label: "Meesho" },
  Myntra: { color: "#FF3F6C", text: "#ffffff", label: "Myntra" },
  Ajio: { color: "#D4AF37", text: "#1a1a1a", label: "Ajio" },
  PriceRadar: { color: "#F2B705", text: "#0B2545", label: "PriceRadar" },
};

export const formatINR = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    num || 0
  );
