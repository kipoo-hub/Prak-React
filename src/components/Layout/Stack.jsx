export default function Stack({ children, direction = "col", gap = 4, className = "", align = "stretch", justify = "start" }) {
    const directionStyles = {
        col: "flex-col",
        row: "flex-row",
    };

    const gapStyles = {
        2: "gap-2",
        4: "gap-4",
        6: "gap-6",
        8: "gap-8"
    };

    const alignStyles = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch"
    };

    const justifyStyles = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between"
    };

    return (
        <div className={`flex ${directionStyles[direction]} ${gapStyles[gap]} ${alignStyles[align]} ${justifyStyles[justify]} ${className}`}>
            {children}
        </div>
    );
}
