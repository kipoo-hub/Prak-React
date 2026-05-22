import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true) // Tambahkan state loading eksplisit

    useEffect(() => {
        setLoading(true)
        setError(null)

        axios
            .get(`https://dummyjson.com/products/${id}`)
            .then((response) => {
                // Axios menjamin response di sini selalu berstatus 2xx
                setProduct(response.data)
            })
            .catch((err) => {
                // Error 404 atau network error otomatis ditangkap di sini
                // Mengambil pesan error yang lebih spesifik dari respon server jika ada
                const errorMessage = err.response?.data?.message || err.message
                setError(errorMessage)
            })
            .finally(() => {
                setLoading(false)
            })
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
            {/* Tombol Navigasi Kembali */}
            <div className="mb-4 max-w-lg mx-auto">
                <Link to="/products" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                    ← Kembali ke Daftar Produk
                </Link>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto border border-gray-100">
                <img
                    src={product.thumbnail || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
                    alt={product.title}
                    className="rounded-xl mb-5 w-full h-48 object-cover shadow-sm"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{product.title}</h2>
                
                <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <p><span className="font-semibold text-gray-400 uppercase text-xs block mb-0.5">Kategori</span> {product.category}</p>
                    <p><span className="font-semibold text-gray-400 uppercase text-xs block mb-0.5">Brand / Vendor</span> {product.brand || "-"}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Harga Aplikasi</span>
                    <p className="text-xl font-black text-orange-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price * 1000)}
                    </p>
                </div>
            </div>
        </div>
    )
}