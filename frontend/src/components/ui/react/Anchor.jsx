export default function Anchor({
    type = "link", // link or button
    variant = "primary",
    size = "medium",
    underlineOnHover = false,
    outline = false,
    className,
    children,
    ...rest
}) {
    const variantMappingLink = {
        primary: "link-primary",
        secondary: "link-secondary",
        ghost: "link-ghost",
        info: "link-info",
        success: "link-success",
        warning: "link-warning",
        error: "link-error",
        danger: "link-error",
        accent: "link-accent",
        neutral: "link-neutral",
    };
    const variantMappingButton = {
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
    const sizeMappingButton = {
        extraSmall: "btn-xs",
        small: "btn-sm",
        medium: "btn-md",
        large: "btn-lg",
        extraLarge: "btn-xl",
    };
    const baseClass = `${type === "link" ? "link" : "btn inline-flex items-center justify-center"} inline-block`;
    const typeClass = type === "link" ? (
        `${variantMappingLink[variant] || ""} ${underlineOnHover && "link-hover"}`
    ) : (
        `${variantMappingButton[variant] || ""} ${sizeMappingButton[size] || ""} ${outline ? "btn-outline" : ""}`
    )
    const globalClass = `${baseClass} ${typeClass} ${className || ""}`;
    return (
        <a className={globalClass} {...rest}>
            {children}
        </a>
    );
}