
export default function Label({ className, children, ...rest }) {
    const baseClass = `label inline-block`;
    const globalClass = `${baseClass} ${className || ""}`;
    return (
        <label className={globalClass} {...rest}>
            {children}
        </label>
    );
}
