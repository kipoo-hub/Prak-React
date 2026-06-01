import { useState } from 'react';

export default function Tooltip({ children, text }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="relative inline-flex"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute z-10 w-max px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg -top-8 left-1/2 -translate-x-1/2 shadow-lg animate-fade-in">
                    {text}
                    {/* Tooltip arrow */}
                    <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
}
