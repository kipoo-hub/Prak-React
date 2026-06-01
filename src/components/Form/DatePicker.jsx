export default function DatePicker({ label, id, className = "", ...props }) {
    // using basic HTML5 date input for simplicity
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>}
            <input 
                type="date" 
                id={id} 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm text-gray-600"
                {...props}
            />
        </div>
    );
}
