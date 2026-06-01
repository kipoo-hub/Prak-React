export default function PricingSection({ plans = [] }) {
    return (
        <div className="my-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Simple, transparent pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                    <div key={index} className={`bg-white rounded-3xl p-8 border ${plan.isPopular ? 'border-green-500 shadow-2xl shadow-green-100 scale-105 z-10' : 'border-gray-100 shadow-xl shadow-gray-200/50'} relative`}>
                        {plan.isPopular && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Most Popular</span>
                        )}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                        <div className="text-4xl font-extrabold text-gray-900 mb-6">
                            {plan.price}<span className="text-base text-gray-400 font-medium">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-xs">✓</div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.isPopular ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
