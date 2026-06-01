export default function Image({ src, alt = "image", className = "", rounded = "rounded-2xl", ...props }) {
    return (
        <img 
            src={src} 
            alt={alt} 
            className={`object-cover shadow-lg ${rounded} ${className}`} 
            {...props} 
        />
    );
}
