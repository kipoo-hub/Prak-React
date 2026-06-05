import React from "react";
import PageHeader from "../components/PageHeader";
import { HiOutlineLightningBolt, HiOutlineArrowLeft } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // 1. CardAction dihapus

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

        {/* 2. MAIN CONTENT */}
        <div className="mt-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 gap-8">
          
          {/* Badge & Info Section */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-amber-100 animate-pulse">
              <HiOutlineLightningBolt />
            </div>

            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100 mb-4">
              Eksperimen Lab 🧪
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
              Selamat Datang di Halaman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fitur XYZ</span>
            </h1>

            <p className="text-slate-500 leading-relaxed text-base max-w-md">
              Halaman ini berhasil dimuat! Di sini nantinya akan menjadi tempat pengujian sistem analitik otomatis terbaru.
            </p>
          </div>

          {/* 2.1 BUTTON EXPERIMENTS (Fix typo dari variants ke variant) */}
          <div className="flex flex-wrap gap-3 justify-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm w-full">
            <Button variant="outline">test</Button>
            <Button variant="secondary">test secondary</Button>
            <Button variant="ghost">Hello</Button>
            <Button variant="destructive">danger</Button>
          </div>

          {/* 2.2 CARD DEMO COMPONENT (Dimasukkan ke dalam wrapper utama JSX) */}
          <Card className="w-full max-w-sm text-left bg-white/90 backdrop-blur-sm border border-slate-100 shadow-xl">
            {/* Menggunakan flex-row & justify-between sebagai pengganti CardAction */}
            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-4">
              <div className="grid gap-1">
                <CardTitle className="text-lg font-bold">Login to your account</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Enter your email below to login to your account
                </CardDescription>
              </div>
              <Button variant="link" className="p-0 h-auto font-bold text-xs text-blue-600">
                Sign Up
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-xs font-semibold text-slate-500">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-500">Password</label>
                  <a href="#" className="text-xs text-slate-400 hover:text-slate-900 underline underline-offset-4">
                    Forgot your password?
                  </a>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required 
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                Login
              </Button>
              <Button variant="outline" className="w-full rounded-xl">
                Login with Google
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>

      {/* 3. FOOTER */}
      <div className="relative z-10 text-center text-xs text-slate-400 mt-12">
        <p>© {new Date().getFullYear()} - Muhammad Taufiq • Development Environment</p>
      </div>
    </div>
  );
}