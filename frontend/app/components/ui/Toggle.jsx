export default function Toggle({ variant = "neutral", checked = false, size = "medium", className }) {
    const variantMapping = {
        primary: "toggle-primary",
        secondary: "toggle-secondary",
        accent: "toggle-accent",
        neutral: "toggle-neutral",
        info: "toggle-info",
        success: "toggle-success",
        warning: "toggle-warning",
        error: "toggle-error"
    };
    const sizeMapping = {
        extraSmall: "toggle-xs",
        small: "toggle-sm",
        medium: "toggle-md",
        large: "toggle-lg",
        extraLarge: "toggle-xl"
    };
    const baseClass = "toggle";
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${sizeMapping[size] || ""} ${className || ""}`;
    return (
        <>
            {
                checked ? (
                    <input type="checkbox" defaultChecked className={globalClass} />
                ) : (
                    <input type="checkbox" className={globalClass} />
                )
            }
        </>
    )
}
