export default function Title({ variant = "page", className, children, ...rest }) {
    const variantMapping = {
        page: "text-5xl font-semibold",
        section: "text-3xl font-semibold",
        article: "text-2xl font-semibold",
    };
    const baseClass = "";
    const variantClass = variantMapping[variant] || "";
    const globalClass = `${baseClass} ${variantClass} ${className || ""}`;

    switch (variant) {
        case "page":
            return (
                <h1 className={globalClass} {...rest}>
                    {children}
                </h1>
            );
        case "section":
            return (
                <h2 className={globalClass} {...rest}>
                    {children}
                </h2>
            );
        case "article":
            return (
                <h3 className={globalClass} {...rest}>
                    {children}
                </h3>
            );
        default:
            return (
                <h1 className={globalClass} {...rest}>
                    {children}
                </h1>
            );
    }
}
