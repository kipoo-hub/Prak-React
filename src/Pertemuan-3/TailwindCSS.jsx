export default function TailwindCSS(){
    return (
        <>
        <FlexboxGrid/>
            <div>
                <h1 class="border m-4">Belajar Tailwind CSS 4</h1>
                <button className="bg-blue-950 text-yellow-400
             px-4 py-2 mx-4 rounded-2xl
            shadow-lg">Click Me</button>
            </div>
            <Spacing/>
            <Typography/>
            <BorderRadius/>
            <BackgroundColors/>
            <ShadowEffects/>
        </>
    )

    
}

function Spacing(){
    return (
        <div className="bg-blue-950 shadow-lg p-6 m-4 rounded-lg">
            <h2 className="text-white font-semibold">Card Title</h2>
            <p className="mt-2 text-yellow-600">Ini adalah contoh penggunaan padding dan margin di Tailwind.</p>
        </div>
    )
}

function Typography(){
    return (
        <div className="m-4">
            <h1 className="text-2xl font-extrabold text-blue-950">Tailwind Typography</h1>
            <p className="text-gray-600 text-lg mt-2">Belajar Tailwind sangat menyenangkan dan cepat!</p>
        </div>
    )
}

function BorderRadius(){
    return (
        <div>
            <button className="border-2 border-yellow-600 text-yellow-400 bg-blue-950 m-4 px-4 py-2 rounded-4xl"> Klik Saya </button>
            <button className="border-2 border-yellow-600 text-yellow-400 bg-blue-950 m-4 px-4 py-2 rounded-4xl"> Klik Saya </button>
        </div>
    )
}

function BackgroundColors(){
    return(
        <div className="bg-blue-950 text-yellow-600 border-yellow-600 border-2 p-6 rounded-lg shadow-lg m-4">
            <h3 className="text-white font-bold">Tailwind Colors</h3>
            <p className="mt-2">Belajar Tailwind itu seru dan fleksibel!</p>
        </div>
    )
}

function FlexboxGrid(){
    return (
        <nav className="flex justify-between bg-blue-950 p-4 text-white">
            <h1 className="text-yellow-600 font-bold">MyWebsite</h1>
            <ul className="flex space-x-4">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <h1 className="text-yellow-600 font-bold">Log Out</h1>
        </nav>
    )
}

function ShadowEffects(){
    return (
        <div className="bg-blue-950 shadow-lg p-6 rounded-lg hover:rotate-2 transition m-4">
            <h3 className="text-white font-semibold">Hover me!</h3>
            <p className="text-yellow-600 mt-2">Lihat efek bayangan saat hover.</p>
        </div>
    )
}