import React, { useState, lazy, Suspense } from "react"; 
import { Routes, Route, useLocation } from "react-router-dom";
import "./assets/tailwind.css";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Products from './pages/Products';
import Components from "./pages/Components";
import NotFound from "./components/NotFound";
import CobaFiturXYZ from "./pages/Fitur-Xyz";

// Menggunakan Lazy Loading untuk komponen yang lebih berat agar performa lebih optimal
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Note = lazy(() => import("./pages/Note"));

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    // Cek apakah route valid
    const isProductDetail = location.pathname.startsWith("/products/");
    const validRoutes = ["/", "/orders", "/customers", "/products", "/components", "/fitur-xyz", "/notes"];
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
                    {/* Menggunakan Suspense untuk membungkus komponen lazy loading */}
                    <Suspense fallback={<div className="p-4">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Dashboard searchTerm={searchTerm} />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/components" element={<Components />} />
                            <Route path="/fitur-xyz" element={<CobaFiturXYZ />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/notes" element={<Note />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default App;