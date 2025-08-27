export default function Collapse({ label = "my collapse", collapseIcon = "arrow", className, children }) {
    const baseClass = "collapse bg-base-100 border-base-300 border rounded-sm"
    const contentClass = `collapse-content text-sm`;
    const labelClass = "collapse-title font-semibold";
    const globalClass = `${baseClass} ${collapseIcon === "arrow" ? "collapse-arrow" : "collapse-plus"} ${className || ""}`;
    return (
        <div className={globalClass}>
            <input type="checkbox" />
            <div className={labelClass}>{label}</div>
            <div className={contentClass}>
                {children}
            </div>
        </div>
    );
}