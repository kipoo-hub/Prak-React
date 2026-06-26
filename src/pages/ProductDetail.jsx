import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getProductById } from "../services/supabaseService"

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setError(null)

        getProductById(id)
            .then((data) => setProduct(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600 font-semibold mb-2">Gagal memuat data: {error}</div>
                <Link to="/products" className="text-orange-600 hover:underline text-sm">
                    ← Kembali ke Daftar Produk
                </Link>
            </div>
        )
    }

    if (loading || !product) {
        return <div className="p-6 text-gray-500 text-center animate-pulse">Memuat detail produk...</div>
    }

    return (
        <div className="p-6 font-sans">
            <div className="mb-4 max-w-lg mx-auto">
                <Link to="/products" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                    ← Kembali ke Daftar Produk
                </Link>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto border border-gray-100">
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl mb-5 flex items-center justify-center">
                    <span className="text-5xl">{product.category === 'Makanan' ? '🍽️' : product.category === 'Minuman' ? '🥤' : product.category === 'Dessert' ? '🍰' : '🍿'}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{product.name}</h2>
                {product.sku && <p className="text-xs font-mono text-gray-400 mb-3">SKU: {product.sku}</p>}
                
                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-400 uppercase text-xs block mb-0.5">Kategori</span> {product.category}</p>
                    <p><span className="font-semibold text-gray-400 uppercase text-xs block mb-0.5">Brand / Vendor</span> {product.brand || "-"}</p>
                    <p><span className="font-semibold text-gray-400 uppercase text-xs block mb-0.5">Stok</span> {product.stock}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Harga Aplikasi</span>
                    <p className="text-xl font-black text-orange-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                    </p>
                </div>
            </div>
        </div>
    )
}