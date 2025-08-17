export default function Button({
    variant = "primary",
    outline = false,
    size = "medium",
    className,
    children,
    ...rest
}) {
    const variantMapping = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        info: "btn-info",
        success: "btn-success",
        warning: "btn-warning",
        error: "btn-error",
        danger: "btn-error",
        accent: "btn-accent",
        neutral: "btn-neutral",
    };
    const sizeMapping = {
        extraSmall: "btn-xs",
        small: "btn-sm",
        medium: "btn-md",
        large: "btn-lg",
        extraLarge: "btn-xl",
    };
    const baseClass = `btn inline-block`;
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${sizeMapping[size] || ""} ${outline ? "btn-outline" : ""} ${className || ""}`;
    return (
        <button className={globalClass} {...rest}>
            {children}
        </button>
    );
}
