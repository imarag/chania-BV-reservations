export default function TextArea({ size = "medium", className, ...rest }) {
    const baseClass = `textarea inline-block`;
    const sizeMapping = {
        extraSmall: "textarea-xs",
        small: "textarea-sm",
        medium: "textarea-md",
        large: "textarea-lg",
        extraLarge: "textarea-xl",
    };
    const globalClass = `${baseClass} ${sizeMapping[size] || ""} ${className || ""}`;
    return (
        <textarea
            className={globalClass}
            {...rest}
        ></textarea>
    );
}