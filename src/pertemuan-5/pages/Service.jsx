export default function Service() {
    const services = [
        { title: "Food Delivery", desc: "Fast and reliable delivery for your meals.", icon: "🛵", active: true },
        { title: "Table Reservation", desc: "Book your favorite table in advance.", icon: "🍽️", active: true },
        { title: "Catering Service", desc: "Special menu for your big events.", icon: "🎉", active: false },
        { title: "Daily Promo", desc: "Manage your restaurant discounts.", icon: "🏷️", active: true },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h1>
            <p className="text-gray-400 mb-8">Manage and monitor all active restaurant services.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((svc, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="text-4xl mb-4">{svc.icon}</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{svc.title}</h3>
                        <p className="text-sm text-gray-500 mb-6">{svc.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${svc.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {svc.active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                            <button className="text-sm font-semibold text-blue-500 hover:underline">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}