export default function Text({ children, variant = "body", className = "", ...props }) {
    const variants = {
        h1: "text-4xl font-extrabold text-gray-900",
        h2: "text-3xl font-bold text-gray-800",
        h3: "text-2xl font-bold text-gray-800",
        h4: "text-xl font-bold text-gray-800",
        body: "text-base text-gray-600",
        caption: "text-xs text-gray-400 font-medium",
    };

    const Tag = variant.match(/^h[1-6]$/) ? variant : variant === "caption" ? "span" : "p";

    return (
        <Tag className={`${variants[variant] || variants.body} ${className}`} {...props}>
            {children}
        </Tag>
    );
}
