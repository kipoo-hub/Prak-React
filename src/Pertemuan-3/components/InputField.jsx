export default function InputField( {label, type, placeholder} ) {
    return (
        <div className="mb-3">
            <label className="block text-blue-950 font-medium">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded"
            />
        </div>
    );
}
