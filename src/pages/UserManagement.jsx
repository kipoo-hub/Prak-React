import { useState, useEffect } from "react";
import { getUsers, updateUserRole } from "../services/supabaseService";
import { HiShieldCheck, HiUser, HiOutlineLightningBolt } from "react-icons/hi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setUsers(await getUsers());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      alert("Gagal mengubah role: " + err.message);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola role & akses pengguna</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Nama</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Tier</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Total Poin</th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500">Memuat...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500">Belum ada user</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center font-black text-white text-sm">
                        {user.full_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{user.full_name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{user.id?.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                      ${user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {user.role === "admin" ? <HiShieldCheck /> : <HiUser />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.member_tiers?.name || "-"}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">{user.total_points}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold bg-white cursor-pointer focus:ring-2 focus:ring-green-500/20 outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
        <HiOutlineLightningBolt className="text-amber-500" />
        Hanya admin yang bisa mengubah role user
      </div>
    </div>
  );
}
