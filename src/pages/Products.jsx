import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createProduct } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const { profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Makanan',
    brand: '',
    price: '',
    stock: ''
  });

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    } finally {
      setLoading(false);
    }
  }

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

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.brand || !newProduct.price || !newProduct.stock) {
      alert("Harap isi semua field terlebih dahulu!");
      return;
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        brand: newProduct.brand,
        price: parseInt(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0,
        created_by: profile?.id,
      };

      await createProduct(productData);
      setNewProduct({ name: '', category: 'Makanan', brand: '', price: '', stock: '' });
      await loadProducts();
    } catch (err) {
      alert('Gagal menambahkan produk: ' + err.message);
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar & Kelola Produk</h1>
        <p className="text-sm text-gray-500">Kelola menu makanan dan minuman aplikasi Kipo disini.</p>
      </div>

      {/* FORM TAMBAH PRODUK */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tambah Menu Baru</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Produk</label>
            <input type="text" name="name" value={newProduct.name} onChange={handleInputChange}
              placeholder="Contoh: Es Teh Manis"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Kategori</label>
            <select name="category" value={newProduct.category} onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Brand / Dapur</label>
            <input type="text" name="brand" value={newProduct.brand} onChange={handleInputChange}
              placeholder="Contoh: Sedap Kitchen"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Harga (IDR)</label>
            <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Stok</label>
              <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm h-[38px]">
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* TABEL PRODUK */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Kode</th>
              <th className="px-6 py-3.5">Nama Produk</th>
              <th className="px-6 py-3.5">Kategori</th>
              <th className="px-6 py-3.5">Brand</th>
              <th className="px-6 py-3.5">Harga</th>
              <th className="px-6 py-3.5">Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-500">Memuat data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-500">Belum ada produk</td></tr>
            ) : (
              products.map((produk) => (
                <tr key={produk.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-700 text-xs">{produk.sku || '-'}</td>
                  <td className="px-6 py-4">
                    <Link to={`/products/${produk.id}`} className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                      {produk.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${produk.category === 'Makanan' ? 'bg-green-50 text-green-700' : produk.category === 'Minuman' ? 'bg-blue-50 text-blue-700' : produk.category === 'Dessert' ? 'bg-purple-50 text-purple-700' : 'bg-yellow-50 text-yellow-700'}`}>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;