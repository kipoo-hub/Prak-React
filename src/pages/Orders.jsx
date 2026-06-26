import { useState, useEffect } from "react";
import { getOrders, getProducts, getCustomers, createOrder, createOrderItems, awardPoints, updateOrderStatus } from "../services/supabaseService";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { HiPlus, HiOutlineDocumentDownload, HiOutlineCube } from "react-icons/hi";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
  paid: "bg-blue-50 text-blue-600 border-blue-100",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  cancelled: "bg-slate-50 text-slate-500 border-slate-100",
};

function formatRupiah(val) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {status}
    </span>
  );
}

export default function Orders({ searchTerm = "" }) {
  const { profile, isAdmin } = useAuth();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      let orders = await getOrders();
      // Member hanya melihat order miliknya
      if (!isAdmin && profile?.id) {
        const { data: myCustomers } = await supabase
          .from("customers")
          .select("id")
          .eq("profile_id", profile.id);
        const myCustomerIds = myCustomers?.map((c) => c.id) || [];
        orders = orders.filter((o) => myCustomerIds.includes(o.customer_id));
      }
      setOrderList(orders);
    }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function openCreateDialog() {
    const [prodData, custData] = await Promise.all([getProducts(), getCustomers()]);
    setProducts(prodData);
    setCustomers(custData);
    setCart([]);
    // Untuk member: auto-pilih customer miliknya sendiri
    if (!isAdmin && profile?.id) {
      const myCustomer = custData.find((c) => c.profile_id === profile.id);
      setSelectedCustomer(myCustomer?.id || "");
    } else {
      setSelectedCustomer("");
    }
    setShowDialog(true);
  }

  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((c) => c.product_id === productId);
    if (existing) {
      setCart(cart.map((c) => (c.product_id === productId ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: Number(product.price), qty: 1 }]);
    }
  }

  function removeFromCart(productId) {
    setCart(cart.filter((c) => c.product_id !== productId));
  }

  function updateQty(productId, qty) {
    if (qty < 1) return removeFromCart(productId);
    setCart(cart.map((c) => (c.product_id === productId ? { ...c, qty } : c)));
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  async function handleCreateOrder() {
    if (!selectedCustomer) return alert("Pilih customer terlebih dahulu");
    if (cart.length === 0) return alert("Pilih minimal 1 produk");
    setSaving(true);
    try {
      const order = await createOrder({
        order_number: `ORD-${Date.now()}`,
        customer_id: selectedCustomer,
        total_amount: cartTotal,
        created_by: profile?.id,
      });
      await createOrderItems(cart.map((c) => ({
        order_id: order.id,
        product_id: c.product_id,
        product_name: c.name,
        unit_price: c.price,
        quantity: c.qty,
        subtotal: c.price * c.qty,
      })));
      const customer = customers.find((c) => c.id === selectedCustomer);
      if (customer?.profile_id) {
        try { await awardPoints(customer.profile_id, order.id, cartTotal); }
        catch (e) { console.warn("Points award skipped:", e.message); }
      }
      setShowDialog(false);
      await loadOrders();
    } catch (err) { alert("Gagal: " + err.message); }
    finally { setSaving(false); }
  }

  async function handleStatusChange(orderId, newStatus) {
    try { await updateOrderStatus(orderId, newStatus); await loadOrders(); }
    catch (err) { alert("Gagal: " + err.message); }
  }

  const filtered = orderList.filter(
    (o) => o.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12 relative overflow-hidden text-slate-900 font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/30 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/20 blur-[100px] rounded-full"></div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter italic text-slate-950">Orders<span className="text-indigo-600">.</span></h1>
            <div className="text-gray-400 text-sm">Operations / Orders</div>
          </div>
          <div className="flex gap-3">
            <button className="hidden md:flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 text-slate-500 rounded-2xl hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all font-bold text-xs uppercase tracking-widest">
              <HiOutlineDocumentDownload className="text-lg" /> Report
            </button>
            <button onClick={openCreateDialog} className="group flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 transition-all font-bold text-sm">
              <HiPlus className="group-hover:rotate-90 transition-transform" /> Create Order
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Order Ref</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Client</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Status</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-32 text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-32">
                  <div className="flex flex-col items-center justify-center grayscale opacity-20">
                    <HiOutlineCube className="text-8xl mb-4" />
                    <p className="text-2xl font-black uppercase tracking-widest italic">Belum ada pesanan</p>
                  </div>
                </td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3 font-mono text-[11px] font-black text-indigo-500">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform"></span>
                        {o.order_number}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm border border-white shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {o.customers?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{o.customers?.name || "Unknown"}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(o.created_at).toLocaleDateString("id-ID")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      {isAdmin ? (
                        <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`inline-flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border cursor-pointer outline-none ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (<StatusBadge status={o.status} />)}
                    </td>
                    <td className="px-10 py-6 text-right font-black text-slate-900 text-sm">{formatRupiah(o.total_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setShowDialog(false)}></div>
            <div className="relative bg-white/90 border border-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] max-w-lg w-full p-12 max-h-[90vh] overflow-y-auto">
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3"><HiPlus className="text-3xl" /></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Buat Pesanan</h2>
                <p className="text-slate-400 text-sm mt-2">Pilih customer dan produk</p>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Customer</label>
                  {isAdmin ? (
                    // Admin: dropdown pilih customer
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-[1.2rem] px-6 py-4 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/5 focus:bg-white shadow-inner transition-all">
                      <option value="">-- Pilih Customer --</option>
                      {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : selectedCustomer ? (
                    // Member: tampilkan nama customer saja (read-only, auto-selected)
                    <div className="w-full bg-indigo-50 border border-indigo-100 rounded-[1.2rem] px-6 py-4 text-indigo-700 font-bold shadow-inner flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-black text-sm">
                        {customers.find((c) => c.id === selectedCustomer)?.name?.charAt(0) || "?"}
                      </div>
                      <span>{customers.find((c) => c.id === selectedCustomer)?.name || "-"}</span>
                    </div>
                  ) : (
                    // Member tanpa customer
                    <div className="w-full bg-amber-50 border border-amber-100 rounded-[1.2rem] px-6 py-4 text-amber-700 font-bold shadow-inner">
                      Anda belum memiliki profil customer. Silakan hubungi admin untuk mendaftar.
                    </div>
                  )}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Tambah Produk</label>
                  <select onChange={(e) => { if (e.target.value) { addToCart(e.target.value); e.target.value = ""; }}}
                    className="w-full bg-slate-50 border-none rounded-[1.2rem] px-6 py-4 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/5 focus:bg-white shadow-inner transition-all">
                    <option value="">-- Pilih Produk --</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatRupiah(p.price)}</option>)}
                  </select>
                </div>
                {cart.length > 0 && (
                  <div className="space-y-2 bg-slate-50/50 rounded-[1.5rem] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Keranjang</p>
                    {cart.map((c) => (
                      <div key={c.product_id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{formatRupiah(c.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button onClick={() => updateQty(c.product_id, c.qty - 1)} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-bold hover:bg-slate-200">−</button>
                          <span className="font-black text-sm w-6 text-center text-slate-800">{c.qty}</span>
                          <button onClick={() => updateQty(c.product_id, c.qty + 1)} className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-bold hover:bg-slate-200">+</button>
                          <button onClick={() => removeFromCart(c.product_id)} className="ml-1 text-slate-300 hover:text-red-500 text-sm font-bold">✕</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total</span>
                      <span className="text-xl font-black text-slate-900">{formatRupiah(cartTotal)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-12 flex flex-col gap-3">
                <button onClick={handleCreateOrder} disabled={saving}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-600 shadow-2xl shadow-indigo-100 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50">
                  {saving ? "MENYIMPAN..." : "BUAT PESANAN"}
                </button>
                <button onClick={() => setShowDialog(false)} className="w-full text-slate-400 font-bold py-2 text-[10px] uppercase tracking-[0.3em] hover:text-rose-500 transition-colors">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
