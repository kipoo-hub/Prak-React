export default function Toast({ message, type = "success", isVisible }) {
    if (!isVisible) return null;

    const types = {
        success: "bg-green-500 shadow-green-200",
        error: "bg-red-500 shadow-red-200",
        info: "bg-blue-500 shadow-blue-200",
    };

    return (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-xl text-white font-medium text-sm animate-fade-in ${types[type]} z-50`}>
            {message}
        </div>
    );
}
