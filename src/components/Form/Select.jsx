export default function Select({ label, id, options = [], className = "", ...props }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>}
            <select 
                id={id} 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm appearance-none"
                {...props}
            >
                <option value="" disabled selected hidden>Select an option</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
