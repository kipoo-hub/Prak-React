export default function Checkbox({ label, id, className = "", ...props }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input 
                type="checkbox" 
                id={id} 
                className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                {...props}
            />
            {label && <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>}
        </div>
    );
}
