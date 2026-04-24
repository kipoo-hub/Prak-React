import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function Dashboard() {
    const [selected, setSelected] = useState(null);

    // Mock data untuk tabel
    const recentOrders = [
        { id: "#12541", item: "Nasi Goreng Spesial", customer: "Budi Santoso", status: "Completed", date: "12 May, 2026" },
        { id: "#12542", item: "Ayam Bakar Madu", customer: "Siti Aminah", status: "Pending", date: "12 May, 2026" },
        { id: "#12543", item: "Es Teh Manis", customer: "Andi Wijaya", status: "Canceled", date: "11 May, 2026" },
    ];

    return (
        <div className="p-6">
            {/* Title Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-400">Selamat datang kembali, Muhammad Taufiq!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Orders */}
                <div 
                    onClick={() => setSelected("Total Orders")}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                            🛒
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                            <FaArrowUp className="mr-1" /> 12%
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">75</h2>
                    <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                </div>

                {/* Total Revenue */}
                <div 
                    onClick={() => setSelected("Total Revenue")}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                            💰
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                            <FaArrowUp className="mr-1" /> 8%
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Rp 12.8M</h2>
                    <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                </div>

                {/* Total Users */}
                <div 
                    onClick={() => setSelected("Total Users")}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            👥
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                            <FaArrowDown className="mr-1" /> 2%
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">1,250</h2>
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                </div>

                {/* Canceled Orders */}
                <div 
                    onClick={() => setSelected("Total Canceled")}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-red-100 text-red-600 p-3 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                            ⛔
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">40</h2>
                    <p className="text-gray-400 text-sm font-medium">Total Canceled</p>
                </div>
            </div>

            {/* Recent Orders Table Section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Recent Orders</h3>
                    <button className="text-sm text-green-500 font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Order ID</th>
                                <th className="px-6 py-4 font-bold">Item Name</th>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{order.item}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.customer}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                            order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL (Tetap sama dengan milikmu) */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{selected}</h2>
                        <p className="text-gray-500 mb-6">
                            Detail data performa untuk <span className="font-bold text-gray-700">{selected}</span> pada periode ini.
                        </p>
                        <button
                            onClick={() => setSelected(null)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-red-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}