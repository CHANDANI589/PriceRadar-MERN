import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { formatINR } from "../../utils/platforms";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const load = () => api.get("/products?limit=200").then(({ data }) => setProducts(data.products));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await api.delete(`/products/${id}`); toast.success("Product deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-2xl text-navy">Manage Products</h1>
        <Link to="/admin/products/new" className="flex items-center gap-1.5 bg-mustard hover:bg-mustard-light text-navy font-semibold px-4 py-2 rounded-full transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr><th className="text-left px-4 py-3">Product</th><th className="text-left px-4 py-3">Category</th><th className="text-left px-4 py-3">Lowest Price</th><th className="text-left px-4 py-3">Platforms</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-slate-50">
                <td className="px-4 py-3 flex items-center gap-2"><img src={p.images?.[0]} className="w-10 h-10 rounded-lg object-cover" alt="" /><span className="line-clamp-1 max-w-xs">{p.title}</span></td>
                <td className="px-4 py-3 text-slate-500">{p.category}</td>
                <td className="px-4 py-3 font-mono-price font-semibold text-navy">{formatINR(p.lowestPrice)}</td>
                <td className="px-4 py-3 text-slate-500">{p.platformPrices?.length}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-navy hover:text-mustard-dark inline-block mr-3"><Pencil size={15} /></Link>
                  <button onClick={() => handleDelete(p._id)} className="text-slate-400 hover:text-coral"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
