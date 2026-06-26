import { useState, useEffect } from "react";
import { getTiers, createTier, updateTier, deleteTier } from "../services/supabaseService";
import { HiOutlineLightningBolt, HiPlus, HiTrash, HiPencil } from "react-icons/hi";

export default function TierManagement() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", min_points: "", discount_percent: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadTiers(); }, []);

  async function loadTiers() {
    try {
      setLoading(true);
      setTiers(await getTiers());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingTier(null);
    setForm({ name: "", min_points: "", discount_percent: "" });
    setShowForm(true);
  }

  function openEdit(tier) {
    setEditingTier(tier.id);
    setForm({ name: tier.name, min_points: String(tier.min_points), discount_percent: String(tier.discount_percent) });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nama tier harus diisi");
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        min_points: parseInt(form.min_points) || 0,
        discount_percent: parseFloat(form.discount_percent) || 0,
      };
      if (editingTier) {
        await updateTier(editingTier, data);
      } else {
        await createTier(data);
      }
      setEditingTier(null);
      setShowForm(false);
      setForm({ name: "", min_points: "", discount_percent: "" });
      await loadTiers();
    } catch (err) {
      alert("Gagal: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin hapus tier ini?")) return;
    try {
      await deleteTier(id);
      await loadTiers();
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tier Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola level member & benefit poin</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-sm">
          <HiPlus className="text-lg" />
          Tambah Tier
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editingTier ? "Edit Tier" : "Tambah Tier Baru"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Tier</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Contoh: Platinum"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Min. Poin</label>
              <input type="number" value={form.min_points} onChange={(e) => setForm({...form, min_points: e.target.value})}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Diskon (%)</label>
              <input type="number" step="0.01" value={form.discount_percent} onChange={(e) => setForm({...form, discount_percent: e.target.value})}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 text-sm">
                {saving ? "..." : "Simpan"}
              </button>
              <button type="button" onClick={() => { setEditingTier(null); setShowForm(false); setForm({ name: "", min_points: "", discount_percent: "" }); }}
                className="px-5 py-2 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Nama</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Min. Poin</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Diskon</th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">Memuat...</td></tr>
            ) : tiers.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">Belum ada tier</td></tr>
            ) : (
              tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{tier.name}</td>
                  <td className="px-6 py-4 text-gray-600">{tier.min_points.toLocaleString()} pts</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{tier.discount_percent}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(tier)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><HiPencil /></button>
                    <button onClick={() => handleDelete(tier.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><HiTrash /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
