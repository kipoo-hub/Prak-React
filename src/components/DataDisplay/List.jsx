export default function List({ items, className = "" }) {
    return (
        <ul className={`divide-y divide-gray-100 ${className}`}>
            {items.map((item, idx) => (
                <li key={idx} className="py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                </li>
            ))}
        </ul>
    );
}
