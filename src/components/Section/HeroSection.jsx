export default function HeroSection({ title, subtitle, ctaText, onCtaClick }) {
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-green-200 text-white my-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{title}</h1>
            <p className="text-green-50 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">{subtitle}</p>
            {ctaText && (
                <button 
                    onClick={onCtaClick}
                    className="bg-white text-green-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    {ctaText}
                </button>
            )}
        </div>
    );
}
