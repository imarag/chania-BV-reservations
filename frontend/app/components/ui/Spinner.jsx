export default function Spinner({ variant = "accent", type = "spinner", size = "medium", className }) {
    const variantMapping = {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        neutral: "text-neutral",
        info: "text-info",
        success: "text-success",
        warning: "text-warning",
        error: "text-error"
    };
    const typeMapping = {
        spinner: "loading-spinner",
        dots: "loading-dots",
        ring: "loading-ring",
        ball: "loading-ball",
        bars: "loading-bars",
        infinity: "loading-infinity"
    }
    const sizeMapping = {
        extraSmall: "loading-xs",
        small: "loading-sm",
        medium: "loading-md",
        large: "loading-lg",
        extraLarge: "loading-xl"
    };
    const baseClass = `loading inline-block`;
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${typeMapping[type] || ""} ${sizeMapping[size] || ""} ${className || ""}`;
    return (
        <span className={globalClass}></span>
    );
}
