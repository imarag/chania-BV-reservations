import Button from "../ui/Button";

export default function FormContainer({
    title = "My Form",
    handleFormSubmit = () => {},
    buttonLabel = "Submit",
    className,
    children,
}) {
    const baseClass =
        "bg-base-200 rounded-md shadow-md p-8 mb-4 space-y-6 w-full max-w-md";
    const titleClass = "text-2xl font-bold mb-4 text-center";
    const contentClass = "space-y-4";
    const globalClass = `${baseClass} ${className || ""}`;

    return (
        <div className={globalClass}>
            {title && <h2 className={titleClass}>{title}</h2>}
            <form onSubmit={handleFormSubmit} className={contentClass}>
                {children}
                <div className="text-center">
                    <Button type="submit">{buttonLabel}</Button>
                </div>
            </form>
        </div>
    );
}
