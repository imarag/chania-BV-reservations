export default function Avatar({ imageSrc, size = "medium", shape = "rounded", className }) {
    const sizeMapping = {
        small: "w-16",
        medium: "w-20",
        large: "w-32",
    };
    const shapeMapping = {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-md",
    };
    const baseClass = "avatar";
    const globalClass = `${baseClass} ${className || ""}`;
    return (
        <div className={globalClass}>
            <div className={`${sizeMapping[size]} ${shapeMapping[shape]}`}>
                <img src={imageSrc} />
            </div>
        </div>
    )
}
