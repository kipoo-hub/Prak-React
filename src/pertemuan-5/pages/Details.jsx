import PageHeader from "../components/PageHeader";

export default function Details() {
    // Simulasi Data
    const orderData = [
        { id: "#00123", date: "24 Apr 2026", customer: "John Doe", location: "Jakarta", amount: "Rp 150.000", status: "Completed" },
        { id: "#00124", date: "24 Apr 2026", customer: "Siti Aminah", location: "Bandung", amount: "Rp 85.000", status: "Pending" },
        { id: "#00125", date: "23 Apr 2026", customer: "Budi Rejeki", location: "Surabaya", amount: "Rp 210.000", status: "Canceled" },
        { id: "#00126", date: "23 Apr 2026", customer: "Anto Wijaya", location: "Medan", amount: "Rp 120.000", status: "Completed" },
    ];

    return (
        <div className="p-6">
            <PageHeader />

            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orderData.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{order.customer}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.location}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                            order.status === "Completed" ? "bg-green-100 text-green-600" :
                                            order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                            "bg-red-100 text-red-600"
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}