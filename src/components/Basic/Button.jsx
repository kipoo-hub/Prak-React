export default function Button({ children, variant = "primary", className = "", ...props }) {
    const baseStyle = "px-4 py-2 rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-sm";
    
    const variants = {
        primary: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200",
        secondary: "bg-gray-900 hover:bg-gray-800 text-white shadow-lg",
        outline: "border-2 border-green-500 text-green-500 hover:bg-green-50",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
