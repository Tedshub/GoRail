export default function ApplicationLogo({ className = 'h-12 w-auto', ...props }) {
    return (
        <img
            src="/logo_1.jpeg"
            alt="GoRail Logo"
            className={`object-contain rounded-xl ${className}`}
            {...props}
        />
    );
}
