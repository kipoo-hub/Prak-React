import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { FaShoppingBag, FaWallet, FaUsers, FaStar, FaBox, FaChartLine, FaGem, FaTrophy, FaArrowUp } from "react-icons/fa";
import { HiOutlineArrowRight, HiOutlineLightningBolt, HiOutlineCube } from "react-icons/hi";
import { getDashboardStats, getMemberDashboardStats, getOrders } from "../services/supabaseService";
import { useAuth } from "../contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function formatRupiah(val) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
}

function StatCard({ label, value, icon, color, bg, onClick }) {
  return (
    <div onClick={onClick} className="group p-6 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1">
      <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <h2 className="text-3xl font-black text-slate-800 mt-1">{value}</h2>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3">
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-black text-blue-600">{formatRupiah(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

// ==============================
// ADMIN DASHBOARD
// ==============================
function AdminDashboard({ searchTerm }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ orderCount: 0, totalRevenue: 0, customerCount: 0, productCount: 0, revenueByDate: [] });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    Promise.all([getDashboardStats(), getOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = recentOrders.filter((o) => {
    const s = searchTerm.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(s) ||
      o.customers?.name?.toLowerCase().includes(s) ||
      String(o.total_amount).includes(s)
    );
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Welcome */}
      <p className="text-slate-500 mt-2 mb-8 tracking-tight">
        Selamat datang kembali, <b className="text-slate-800 font-bold">{profile?.full_name || "Admin"}</b> 👋
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Pesanan", value: loading ? "..." : String(stats.orderCount), icon: <FaShoppingBag />, color: "text-blue-600", bg: "bg-blue-50", key: "Volume Pesanan" },
          { label: "Total Revenue", value: loading ? "..." : formatRupiah(stats.totalRevenue), icon: <FaWallet />, color: "text-emerald-600", bg: "bg-emerald-50", key: "Revenue" },
          { label: "Total Customer", value: loading ? "..." : String(stats.customerCount), icon: <FaUsers />, color: "text-violet-600", bg: "bg-violet-50", key: "Customer" },
          { label: "Total Produk", value: loading ? "..." : String(stats.productCount), icon: <FaBox />, color: "text-amber-600", bg: "bg-amber-50", key: "Produk" },
        ].map((stat) => (
          <StatCard key={stat.key}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color} bg={stat.bg}
            onClick={() => setSelectedModal(stat.key)}
          />
        ))}
      </div>

      {/* Chart + Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Performa pendapatan harian</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
              <FaChartLine />
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">Memuat grafik...</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.revenueByDate} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(val) => val?.slice(5) || ""} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff" }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-800">Transaksi Terbaru</h3>
          </div>
          <div className="divide-y divide-slate-50 max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Memuat...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <HiOutlineCube className="text-2xl opacity-40" />
                Belum ada transaksi
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="p-4 hover:bg-blue-50/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono font-bold text-blue-600">{o.order_number}</p>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{o.customers?.name || "Unknown"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{formatRupiah(o.total_amount)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                        ${o.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          o.status === "pending" ? "bg-amber-100 text-amber-700" :
                          o.status === "paid" ? "bg-blue-100 text-blue-700" :
                          "bg-rose-100 text-rose-700"}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedModal(null)}></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              <HiOutlineLightningBolt />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedModal}</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Detail untuk <span className="font-bold text-slate-800">{selectedModal}</span> akan hadir di modul Analisis Pro.
            </p>
            <button onClick={() => setSelectedModal(null)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================
// MEMBER DASHBOARD
// ==============================
function MemberDashboard() {
  const { profile } = useAuth();
  const [memberStats, setMemberStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    getMemberDashboardStats(profile.id)
      .then(setMemberStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const points = memberStats?.totalPoints ?? profile?.total_points ?? 0;
  const currentTier = memberStats?.currentTier ?? profile?.member_tiers ?? null;
  const nextTier = memberStats?.nextTier;
  const orderCount = memberStats?.orderCount ?? 0;
  const lastOrder = memberStats?.lastOrder;

  // Progress to next tier
  const tierMin = currentTier?.min_points ?? 0;
  const nextMin = nextTier?.min_points ?? tierMin + 1000;
  const progress = nextMin > tierMin ? Math.min(((points - tierMin) / (nextMin - tierMin)) * 100, 100) : 100;
  const progressDisplay = Math.max(0, Math.round(progress));
  const pointsNeeded = Math.max(0, nextMin - points);

  const tierColors = {
    Bronze: { bg: "from-amber-700 to-amber-900", badge: "bg-amber-800", accent: "text-amber-500" },
    Silver: { bg: "from-slate-400 to-slate-600", badge: "bg-slate-700", accent: "text-slate-400" },
    Gold: { bg: "from-yellow-500 to-amber-600", badge: "bg-yellow-600", accent: "text-yellow-400" },
  };
  const colors = tierColors[currentTier?.name] || tierColors.Bronze;

  return (
    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Welcome */}
      <p className="text-slate-500 mt-2 mb-8 tracking-tight">
        Hai, <b className="text-slate-800 font-bold">{profile?.full_name || "Member"}</b> 👋
      </p>

      {/* PREMIUM POINT CARD */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.bg} p-8 md:p-10 mb-8 shadow-2xl text-white`}>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">Member Points Card</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight">{profile?.full_name || "Member"}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${colors.badge}`}>
              <FaGem className="text-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Total Points</p>
              <p className="text-5xl md:text-6xl font-black mt-1 tracking-tight">
                {loading ? "..." : points.toLocaleString("id-ID")}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <FaStar className={colors.accent} />
                <span className="text-white/80 text-sm font-bold">{currentTier?.name || "Bronze"} Tier</span>
              </div>
            </div>
            <div className="flex flex-col justify-end items-end">
              <div className="text-right">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Pesanan</p>
                <p className="text-3xl font-black mt-1">{loading ? "..." : String(orderCount)}</p>
              </div>
              {lastOrder && (
                <div className="text-right mt-3">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Terakhir</p>
                  <p className="text-sm font-bold mt-0.5">{formatRupiah(lastOrder.total_amount)}</p>
                  <p className="text-xs text-white/60 mt-0.5">
                    {new Date(lastOrder.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl shrink-0">
            <FaTrophy />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tier Saat Ini</p>
            <p className="text-lg font-black text-slate-800">{loading ? "..." : currentTier?.name || "Bronze"}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-xl shrink-0">
            <FaShoppingBag />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
            <p className="text-lg font-black text-slate-800">{loading ? "..." : String(orderCount)}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl shrink-0">
            <FaWallet />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pesanan Terakhir</p>
            <p className="text-lg font-black text-slate-800">{loading ? "..." : lastOrder ? formatRupiah(lastOrder.total_amount) : "—"}</p>
            {lastOrder && <p className="text-[10px] text-slate-400 mt-0.5">{new Date(lastOrder.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}</p>}
          </div>
        </div>
      </div>

      {/* Tier Progress Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">Progress Tier</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kumpulkan poin untuk naik ke tier berikutnya</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500">{currentTier?.name || "Bronze"}</p>
              <p className="text-[9px] text-slate-400">Saat Ini</p>
            </div>
            {nextTier && (
              <>
                <FaArrowUp className="text-slate-300 text-xs" />
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600">{nextTier.name}</p>
                  <p className="text-[9px] text-slate-400">Selanjutnya</p>
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="h-4 bg-slate-100 rounded-full animate-pulse" />
        ) : (
          <div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressDisplay}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-bold text-slate-500">
                {points.toLocaleString("id-ID")} / {nextMin.toLocaleString("id-ID")} poin
              </span>
              <span className="text-xs font-bold text-amber-600">{progressDisplay}%</span>
            </div>
            {nextTier && pointsNeeded > 0 && (
              <p className="text-xs text-slate-400 mt-2">
                Butuh <b className="text-slate-600">{pointsNeeded.toLocaleString("id-ID")} poin lagi</b> untuk mencapai tier <b className="text-amber-600">{nextTier.name}</b>
              </p>
            )}
            {nextTier && pointsNeeded === 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-bold">
                🎉 Selamat! Anda sudah mencapai syarat tier {nextTier.name}!
              </p>
            )}
            {currentTier?.discount_percent > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700">
                  🎯 Nikmati diskon <span className="text-blue-600">{currentTier.discount_percent}%</span> untuk setiap pembelian sebagai member {currentTier.name}!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================
// MAIN EXPORT
// ==============================
export default function Dashboard({ searchTerm = "" }) {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 relative overflow-hidden text-slate-900 font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/30 blur-[100px] rounded-full"></div>

      <PageHeader
        title={isAdmin ? "Dashboard" : "Dashboard Member"}
        breadcrumb={isAdmin ? ["Dashboard", "Overview"] : ["Dashboard", "Member"]}
      >
        <button className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95">
          <span className="text-xs font-bold uppercase tracking-wider">Analisis</span>
          <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </PageHeader>

      {isAdmin ? (
        <AdminDashboard searchTerm={searchTerm} />
      ) : (
        <MemberDashboard />
      )}
    </div>
  );
}
