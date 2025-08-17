export default function FieldSet({ legend = "", className, children, ...rest }) {
    const baseClass = "fieldset";
    const legendClass = "fieldset-legend";
    const globalClass = `${baseClass} ${className || ""}`;
    return (
        <fieldset className={globalClass} {...rest}>
            <legend className={legendClass}>{legend}</legend>
            {children}
        </fieldset>
    );
}