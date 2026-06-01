export default function Card({ children, className = "", title, footer }) {
    return (
        <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {footer}
                </div>
            )}
        </div>
    );
}
