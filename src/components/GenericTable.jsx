import React from 'react'

export default function GenericTable({ columns, data, renderRow }) {
    return (
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-2xl shadow-lg">
            {/* Mengganti bg-hijau menjadi bg-emerald-600 dan teks rata kiri agar rapi */}
            <thead className="text-white bg-emerald-600 text-left">
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} className="px-6 py-3 font-semibold tracking-wider text-sm">
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                        {renderRow(item, index)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}