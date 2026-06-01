export default function Footer({ copyright }) {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">S</span>
                    </div>
                    <span className="font-bold text-gray-800">Sedap<span className="text-green-500">.</span></span>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    &copy; {new Date().getFullYear()} {copyright || "All rights reserved."}
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">GitHub</a>
                    <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Dribbble</a>
                </div>
            </div>
        </footer>
    );
}
