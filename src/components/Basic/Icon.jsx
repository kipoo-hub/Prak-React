export default function Icon({ children, className = "" }) {
    return (
        <span className={`inline-flex items-center justify-center ${className}`}>
            {children}
        </span>
    );
}
