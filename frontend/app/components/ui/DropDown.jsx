export default function DropDown({
    label = "my dropdown",
    position = "dropdown-start",
    hover = false,
    type = "menu", // menu or card
    className,
    children,
}) {
    const positionMapping = {
        bottomLeft: "dropdown-bottom dropdown-end",
        bottomRight: "dropdown-bottom",
        bottomCenter: "dropdown-bottom dropdown-center",
        topRight: "dropdown-top",
        topCenter: "dropdown-top dropdown-center",
        topLeft: "dropdown-top dropdown-end",
        leftBottom: "dropdown-left",
        leftCenter: "dropdown-left dropdown-center",
        leftTop: "dropdown-left dropdown-end",
        rightBottom: "dropdown-right",
        rightCenter: "dropdown-right dropdown-center",
        rightTop: "dropdown-right dropdown-end",
    };
    // type can be menu (in a navbar link dropdown) or card (in a open modal window)
    const baseClass = "dropdown";
    const contentClass =
        type === "menu"
            ? "dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            : "dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md";
    const labelClass = "btn m-1";
    const dropDownCardBody = "card-body";
    const globalClass = `${baseClass} ${positionMapping[position]} ${hover ? "dropdown-hover" : ""} ${className || ""}`;
    return (
        <div className={globalClass}>
            <div tabIndex={0} role="button" className={labelClass}>
                {label}
            </div>
            {type === "menu" ? (
                <ul tabIndex={0} className={contentClass}>{children}</ul>
            ) : (
                <div tabIndex={0} className={contentClass}>
                    <div className={dropDownCardBody}>{children}</div>
                </div>
            )}
        </div>
    );
}
