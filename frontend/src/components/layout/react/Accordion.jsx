export default function Accordion({ label = "my accordion", initialOpen = false, accordionRadioName = "accordion", accordionIcon = "arrow", className, children }) {
    const baseClass = "collapse bg-base-100 border border-base-300 rounded-md";
    const contentClass = "collapse-content text-sm";
    const labelClass = "collapse-title font-semibold";
    const globalClass = `${baseClass} ${accordionIcon === "arrow" ? "collapse-arrow" : "collapse-plus"} ${className || ""} `;
    return (
        <div className={globalClass}>
            {
                initialOpen ? (
                    <input type="radio" name={accordionRadioName} defaultChecked />
                ) : (
                    <input type="radio" name={accordionRadioName} />
                )
            }
            <div className={labelClass}>{label}</div>
            <div className={contentClass}>
                {children}
            </div>
        </div>
    );
}