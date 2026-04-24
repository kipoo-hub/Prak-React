import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./assets/tailwind.css";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import Details from "./pages/Details";
import Service from "./pages/Service"; // Import file baru

function App() {
    // Gunakan state untuk mengontrol halaman mana yang aktif
    const [activePage, setActivePage] = useState("Dashboard");

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Kirim props ke Sidebar agar bisa mengubah state activePage */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <div className="flex-1 flex flex-col">
                <Header />
                
                {/* Render Kondisional berdasarkan activePage */}
                <div className="flex-1 overflow-y-auto">
                    {activePage === "Dashboard" && <Dashboard />}
                    {activePage === "Details" && <Details />}
                    {activePage === "Services" && <Service />}
                </div>
            </div>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<App />);