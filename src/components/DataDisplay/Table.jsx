export default function Table({ headers, data, className = "" }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-100 ${className}`}>
            <table className="w-full text-left border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        {headers.map((header, idx) => (
                            <th key={idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-green-50/50 transition-colors">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="p-4 text-sm text-gray-700">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
