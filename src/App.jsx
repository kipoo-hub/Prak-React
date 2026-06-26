import React, { useState, lazy, Suspense } from "react"; 
import { Routes, Route, useLocation } from "react-router-dom";
import "./assets/tailwind.css";

import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
const TierManagement = lazy(() => import("./pages/TierManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const { session, loading } = useAuth();
    const location = useLocation();

    // Auth pages — tampilkan tanpa layout sidebar/header
    const authPages = ["/login", "/register"];
    const isAuthPage = authPages.includes(location.pathname);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Halaman auth (login/register) — tanpa sidebar
    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        );
    }

    // Cek validasi route untuk dashboard
    const isProductDetail = location.pathname.startsWith("/products/");
    const isAdminRoute = location.pathname.startsWith("/admin/");
    const validRoutes = ["/", "/orders", "/customers", "/products", "/components", "/fitur-xyz", "/notes"];
    const isErrorPage = !validRoutes.includes(location.pathname) && !isProductDetail && !isAdminRoute;

    if (isErrorPage) {
        return <NotFound />;
    }

    // Dashboard layout — dengan sidebar & header
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[#FDFDFD] font-sans">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <div className="flex-1 p-4 overflow-y-auto">
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
                                <Route path="/admin/tiers" element={<TierManagement />} />
                                <Route path="/admin/users" element={<UserManagement />} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default App;