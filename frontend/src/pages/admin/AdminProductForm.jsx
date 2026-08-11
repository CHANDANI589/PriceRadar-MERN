import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

const CATEGORIES = ["Mobiles", "Laptops", "Fashion", "Home & Kitchen", "Electronics", "Beauty", "Footwear", "Accessories"];
const PLATFORMS = ["Amazon", "Flipkart", "Meesho", "Myntra", "Ajio", "PriceRadar"];
const emptyPlatformPrice = { platform: "Amazon", price: "", originalPrice: "", url: "#", rating: 4.2, deliveryDays: 3, inStock: true };
const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", brand: "", category: "Mobiles", description: "", images: "", ourStock: 20 });
  const [platformPrices, setPlatformPrices] = useState([{ ...emptyPlatformPrice }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get("/products?limit=200").then(({ data }) => {
        const p = data.products.find((x) => x._id === id);
        if (p) {
          setForm({ title: p.title, brand: p.brand, category: p.category, description: p.description, images: p.images.join(", "), ourStock: p.ourStock });
          setPlatformPrices(p.platformPrices.map((pp) => ({ ...pp })));
        }
      });
    }
  }, [id, isEdit]);

  const updatePlatform = (idx, field, value) => setPlatformPrices((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  const addPlatformRow = () => setPlatformPrices((prev) => [...prev, { ...emptyPlatformPrice }]);
  const removePlatformRow = (idx) => setPlatformPrices((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title, slug: slugify(form.title), brand: form.brand, category: form.category, description: form.description,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        ourStock: Number(form.ourStock),
        platformPrices: platformPrices.map((p) => ({ ...p, price: Number(p.price), originalPrice: Number(p.originalPrice) || Number(p.price), rating: Number(p.rating), deliveryDays: Number(p.deliveryDays) })),
      };
      if (isEdit) { await api.put(`/products/${id}`, payload); toast.success("Product updated"); }
      else { await api.post("/products", payload); toast.success("Product created"); }
      navigate("/admin/products");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save product"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-2xl text-navy mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <div><label className="text-xs font-semibold text-slate-500">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold text-slate-500">Brand</label>
            <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm" /></div>
          <div><label className="text-xs font-semibold text-slate-500">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select></div>
        </div>
        <div><label className="text-xs font-semibold text-slate-500">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm" /></div>
        <div><label className="text-xs font-semibold text-slate-500">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://... , https://..." className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm" /></div>
        <div><label className="text-xs font-semibold text-slate-500">Our Stock (PriceRadar inventory)</label>
          <input type="number" value={form.ourStock} onChange={(e) => setForm({ ...form, ourStock: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1 text-sm" /></div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-display font-semibold text-navy text-sm">Platform Prices</h3>
            <button type="button" onClick={addPlatformRow} className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-mustard-dark"><Plus size={13} /> Add platform</button>
          </div>
          <div className="space-y-2">
            {platformPrices.map((p, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-slate-50 p-2 rounded-lg">
                <select value={p.platform} onChange={(e) => updatePlatform(idx, "platform", e.target.value)} className="col-span-1 border border-slate-200 rounded px-1.5 py-1 text-xs">
                  {PLATFORMS.map((pl) => <option key={pl}>{pl}</option>)}
                </select>
                <input type="number" placeholder="Price" required value={p.price} onChange={(e) => updatePlatform(idx, "price", e.target.value)} className="col-span-1 border border-slate-200 rounded px-1.5 py-1 text-xs" />
                <input type="number" placeholder="MRP" value={p.originalPrice} onChange={(e) => updatePlatform(idx, "originalPrice", e.target.value)} className="col-span-1 border border-slate-200 rounded px-1.5 py-1 text-xs" />
                <input placeholder="URL" value={p.url} onChange={(e) => updatePlatform(idx, "url", e.target.value)} className="col-span-2 border border-slate-200 rounded px-1.5 py-1 text-xs" />
                <button type="button" onClick={() => removePlatformRow(idx)} className="text-slate-400 hover:text-coral justify-self-end"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <button disabled={saving} className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
