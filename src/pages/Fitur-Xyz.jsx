import React from "react";
import PageHeader from "../components/PageHeader";
import { HiOutlineLightningBolt, HiOutlineArrowLeft } from "react-icons/hi";

export default function CobaFiturXYZ() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 relative overflow-hidden text-slate-900 font-sans flex flex-col justify-between">
            
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-100/40 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/30 blur-[100px] rounded-full"></div>

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                
                {/* 1. HEADER */}
                <PageHeader
                    title="Coba Fitur XYZ"
                    breadcrumb={["Dashboard", "Fitur Baru", "XYZ"]}
                >
                    <button 
                        onClick={() => window.history.back()} 
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                    >
                        <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Kembali</span>
                    </button>
                </PageHeader>

                {/* 2. MAIN CONTENT (Hero Section Simple) */}
                <div className="mt-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
                    {/* Badge Icon */}
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-amber-100 animate-pulse">
                        <HiOutlineLightningBolt />
                    </div>

                    {/* Badge Status */}
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100 mb-4">
                        Eksperimen Lab 🧪
                    </span>

                    {/* Headline */}
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
                        Selamat Datang di Halaman <span className="text-transparent bg-clip-text bg-gradient-to-r flow from-blue-600 to-indigo-600">Fitur XYZ</span>
                    </h1>

                    {/* Deskripsi */}
                    <p className="text-slate-500 leading-relaxed text-base">
                        Halaman ini berhasil dimuat! Di sini nantinya akan menjadi tempat pengujian sistem analitik otomatis terbaru untuk menyaring data transaksi secara instan.
                    </p>

                    {/* Dummy Box Tampilan Fitur */}
                    <div className="w-full mt-10 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm text-left">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Integrasi</span>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <p className="text-sm font-mono text-slate-600">
                            ⚡ <b className="text-slate-800">Sandbox Mode:</b> Siap menerima parameter pengujian berikutnya.
                        </p>
                    </div>
                </div>

            </div>

            {/* 3. FOOTER */}
            <div className="relative z-10 text-center text-xs text-slate-400 mt-12">
                <p>© {new Date().getFullYear()} - Muhammad Taufiq • Development Environment</p>
            </div>
        </div>
    );
}