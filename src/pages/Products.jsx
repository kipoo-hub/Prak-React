import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { products as initialProducts } from '../data/Products';

const Products = () => {
  // 1. State diinisialisasi dengan membaca localStorage terlebih dahulu.
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('kipo_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Makanan',
    brand: '',
    price: '',
    stock: ''
  });

  // 2. Otomatis menyimpan data ke localStorage setiap ada perubahan pada state products
  useEffect(() => {
    localStorage.setItem('kipo_products', JSON.stringify(products));
  }, [products]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.title || !newProduct.brand || !newProduct.price || !newProduct.stock) {
      alert("Harap isi semua field terlebih dahulu!");
      return;
    }

    // 👉 PERBAIKAN UTAMA: Ambil ID angka tertinggi yang ada, lalu tambah 1 (Misal: 30 menjadi 31)
    // Ini krusial agar Axios di ProductDetail bisa menembak ID angka murni ke DummyJSON
    const generatedId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
    const generatedCode = `SKU-${String(generatedId).padStart(4, "0")}`;

    const productToAdd = {
      id: generatedId, // Berupa angka murni (e.g. 31)
      code: generatedCode,
      title: newProduct.title,
      category: newProduct.category,
      brand: newProduct.brand,
      price: parseInt(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0
    };

    setProducts([productToAdd, ...products]);

    setNewProduct({
      title: '',
      category: 'Makanan',
      brand: '',
      price: '',
      stock: ''
    });
  };

  return (
    <div className="p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar & Kelola Produk</h1>
        <p className="text-sm text-gray-500">Kelola menu makanan dan minuman aplikasi Kipo disini.</p>
      </div>

      {/* --- FORM TAMBAH PRODUK --- */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tambah Menu Baru</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Produk</label>
            <input
              type="text"
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              placeholder="Contoh: Es Teh Manis"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Kategori</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Brand / Dapur</label>
            <input
              type="text"
              name="brand"
              value={newProduct.brand}
              onChange={handleInputChange}
              placeholder="Contoh: Sedap Kitchen"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Harga (IDR)</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Stok</label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm h-[38px]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* --- TABEL PRODUK --- */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Kode</th>
              <th className="px-6 py-3.5">Nama Produk</th>
              <th className="px-6 py-3.5">Kategori</th>
              <th className="px-6 py-3.5">Brand</th>
              <th className="px-6 py-3.5">Harga</th>
              <th className="px-6 py-3.5">Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((produk) => (
              <tr key={produk.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{produk.id}</td>
                <td className="px-6 py-4 font-mono font-bold text-gray-700 text-xs">{produk.code}</td>
                <td className="px-6 py-4">
                  {/* Link dinamis sekarang mengirimkan /products/31 dst. */}
                  <Link to={`/products/${produk.id}`} className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                    {produk.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    produk.category === 'Makanan' ? 'bg-green-50 text-green-700' :
                    produk.category === 'Minuman' ? 'bg-blue-50 text-blue-700' :
                    produk.category === 'Dessert' ? 'bg-purple-50 text-purple-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {produk.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{produk.brand}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{formatRupiah(produk.price)}</td>
                <td className="px-6 py-4">
                  <span className={produk.stock < 15 ? 'text-red-500 font-semibold' : 'text-gray-600'}>
                    {produk.stock} {produk.stock < 15 ? '⚠️' : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;