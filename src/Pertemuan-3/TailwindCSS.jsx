export default function TailwindCSS(){
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-16 selection:bg-cyan-500 selection:text-slate-900">
            <FlexboxGrid/>
            <div className="relative flex flex-col items-center justify-center py-24 text-center overflow-hidden">
                {/* Efek Neon Glow pada Teks */}
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] tracking-tighter">
                    Belajar Tailwind CSS 4
                </h1>
                {/* Tombol Glassmorphism dengan efek Hover Neon */}
                <button className="relative group bg-slate-900/50 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-10 py-4 mx-4 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] hover:bg-cyan-400 hover:text-slate-950 transition-all duration-500 font-bold tracking-widest uppercase">
                    Click Me
                </button>
            </div>
            <Spacing/>
            <Typography/>
            <BorderRadius/>
            <BackgroundColors/>
            <ShadowEffects/>
            <DeveloperProfile/>
        </div>
    )
}

function Spacing(){
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] hover:border-purple-500/50 transition-all duration-500 p-8 m-6 md:mx-auto max-w-4xl rounded-2xl group">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-pink-400 group-hover:to-purple-400 transition-all">Card Title</h2>
            <p className="mt-4 text-slate-400 text-lg">Ini adalah contoh penggunaan padding dan margin di Tailwind.</p>
        </div>
    )
}

function Typography(){
    return (
        <div className="m-6 md:mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-900/20 to-transparent border-l-4 border-cyan-400 rounded-r-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-extrabold text-cyan-50 drop-shadow-md tracking-wide">Tailwind Typography</h1>
            <p className="text-cyan-200/70 text-xl mt-3 font-light tracking-wide">Belajar Tailwind sangat menyenangkan dan cepat!</p>
        </div>
    )
}

function BorderRadius(){
    return (
        <div className="flex flex-wrap justify-center gap-6 m-8 py-4">
            <button className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border border-yellow-500/50 text-yellow-400 px-8 py-3 rounded-[2rem] shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.7)] hover:scale-105 hover:bg-yellow-500 hover:text-slate-900 font-bold transition-all duration-300"> Klik Saya </button>
            <button className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border border-fuchsia-500/50 text-fuchsia-400 px-8 py-3 rounded-[2rem] shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:scale-105 hover:bg-fuchsia-500 hover:text-slate-900 font-bold transition-all duration-300"> Klik Saya </button>
        </div>
    )
}

function BackgroundColors(){
    return(
        <div className="relative bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-slate-900 text-yellow-400 border border-indigo-500/30 p-10 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.2)] m-6 md:mx-auto max-w-4xl overflow-hidden group">
            {/* Efek kilauan kaca saat di hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <h3 className="text-3xl text-white font-extrabold mb-2 drop-shadow-lg relative z-10">Tailwind Colors</h3>
            <p className="mt-2 text-indigo-200 text-lg relative z-10">Belajar Tailwind itu seru dan fleksibel!</p>
        </div>
    )
}

function FlexboxGrid(){
    return (
        <nav className="flex justify-between items-center bg-slate-950/80 backdrop-blur-xl px-8 py-5 border-b border-white/10 sticky top-0 z-50">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-black text-2xl drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] cursor-pointer">MyWebsite</h1>
            <ul className="flex space-x-8 hidden md:flex">
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 font-medium tracking-wide transition-colors duration-300 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Home</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 font-medium tracking-wide transition-colors duration-300 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">About</a></li>
                <li><a href="#" className="text-slate-300 hover:text-cyan-400 font-medium tracking-wide transition-colors duration-300 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Contact</a></li>
            </ul>
            <h1 className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] font-bold cursor-pointer transition-all duration-300 px-4 py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10">Log Out</h1>
        </nav>
    )
}

function ShadowEffects(){
    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.6)] p-10 rounded-2xl hover:-translate-y-3 hover:rotate-1 hover:shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:border-cyan-500/50 transition-all duration-500 m-6 md:mx-auto max-w-4xl cursor-pointer group">
            <h3 className="text-2xl text-white font-bold group-hover:text-cyan-400 transition-colors duration-300">Hover me!</h3>
            <p className="text-slate-400 mt-3 text-lg group-hover:text-cyan-100 transition-colors duration-300">Lihat efek bayangan saat hover.</p>
        </div>
    )
}

function DeveloperProfile(){
    return (
        <div className="relative mt-20 bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 md:p-12 rounded-3xl m-6 md:mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-8 group hover:border-purple-500/40 transition-all duration-500 overflow-hidden">
            
            {/* Background Glow Effect Khusus Profil */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700"></div>

            {/* Foto Profil / Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_25px_rgba(34,211,238,0.4)] flex-shrink-0 group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-950">
                    {/* Anda bisa ganti tag <img> di bawah dengan foto asli Anda */}
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-purple-400">DEV</span>
                     <img src="img/Nissan GT R34 poster.jpg" alt="Profile" className="w-full h-full object-cover" /> 
                </div>
            </div>

            {/* Informasi Identitas */}
            <div className="flex-1 text-center md:text-left z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">
                    Muhammad taufiq
                </h2>
                <p className="text-cyan-400 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base">
                    Frontend Web Developer
                </p>
                <p className="text-slate-400 leading-relaxed mb-6 text-lg">
                    Seorang pengembang antarmuka yang antusias dalam menciptakan desain web modern, responsif, dan interaktif menggunakan ekosistem React dan Tailwind CSS.
                </p>
                
                {/* Badges / Skills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-colors cursor-default">React.js</span>
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-colors cursor-default">Tailwind CSS</span>
                    <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors cursor-default">UI/UX Design</span>
                </div>
            </div>
        </div>
    )
}