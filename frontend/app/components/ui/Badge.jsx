export default function Badge({ variant = "accent", size = "medium", outline = false, className, children }) {
    const variantMapping = {
        primary: "badge-primary",
        secondary: "badge-secondary",
        accent: "badge-accent",
        neutral: "badge-neutral",
        info: "badge-info",
        success: "badge-success",
        warning: "badge-warning",
        error: "badge-error"
    };
    const sizeMapping = {
        extraSmall: "badge-xs",
        small: "badge-sm",
        medium: "badge-md",
        large: "badge-lg",
        extraLarge: "badge-xl"
    };
    const baseClass = "badge"
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${sizeMapping[size] || ""} ${outline ? "badge-outline" : ""} ${className || ""}`;
    return (
        <div className={globalClass}>
            {children}
        </div>
    )
}
