export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
