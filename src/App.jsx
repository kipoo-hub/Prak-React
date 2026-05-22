import React, { useState, lazy, Suspense } from "react"; 
import { Routes, Route, useLocation } from "react-router-dom";
import "./assets/tailwind.css";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Products from './pages/Products';
import NotFound from "./components/NotFound";

// 👉 TAMBAHKAN BARIS IMPORT INI
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    // cek apakah route valid
    const isProductDetail = location.pathname.startsWith("/products/");
    const validRoutes = ["/", "/orders", "/customers", "/products"];
    const isErrorPage = !validRoutes.includes(location.pathname) && !isProductDetail;

    if (isErrorPage) {
        return <NotFound />;
    }

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="flex-1 p-4 overflow-y-auto">
                    {/* 👉 Bungkus dengan Suspense karena ProductDetail menggunakan lazy loading */}
                    <Suspense fallback={<div className="p-4">Loading detail produk...</div>}>
                        <Routes>
                            <Route path="/" element={<Dashboard searchTerm={searchTerm} />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/products" element={<Products />} />
                            
                            <Route path="/products/:id" element={<ProductDetail />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default App;