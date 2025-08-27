export default function ToolTip({ message, variant = "neutral", className, children }) {
    const variantMapping = {
        primary: "tooltip-primary",
        secondary: "tooltip-secondary",
        accent: "tooltip-accent",
        neutral: "tooltip-neutral",
        info: "tooltip-info",
        success: "tooltip-success",
        warning: "tooltip-warning",
        error: "tooltip-error"
    };
    const baseClass = "tooltip";
    const globalClass = `${baseClass} ${variantMapping[variant] || ""} ${className || ""}`;
    return (
        <div className={globalClass} data-tip={message}>
            {children}
        </div>
    )
}
