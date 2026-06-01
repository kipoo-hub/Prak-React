export default function Grid({ children, cols = 1, gap = 4, className = "" }) {
    // Tailwind classes for basic grid columns (up to 4 for simplicity)
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    const gapStyles = {
        2: "gap-2",
        4: "gap-4",
        6: "gap-6",
        8: "gap-8"
    };

    return (
        <div className={`grid ${gridCols[cols] || gridCols[1]} ${gapStyles[gap] || gapStyles[4]} ${className}`}>
            {children}
        </div>
    );
}
