import { Link } from "react-router";

/*
the structure of menu links contains two version:
1. if path points to a real page (page: true) or 
2. if it is just a button (page: false)
example:
Version 1:
{
    label: "",
    path: "",
    page: true
}
Version 2:
{
    label: "",
    path: "",
    page: false
    onClick: () => {}
}
*/

export default function DropDown({
    menuLinks,
    position = "dropdown-start",
    hover = false,
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
    const baseClass = "dropdown";
    const contentClass =
        "dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm";
    const globalClass = `${baseClass} ${positionMapping[position]} ${hover ? "dropdown-hover" : ""} ${className || ""}`;
    return (
        <div className={globalClass}>
            <button
                className="btn btn-ghost flex items-center gap-1"
                tabIndex={0}
            >
                {children}
            </button>
            <ul tabIndex={0} className={contentClass}>
                {menuLinks?.map((linkItem, index) => (
                    <li key={linkItem.label}>
                        {linkItem.page ? (
                            <Link
                                to={linkItem.path}
                                className={linkItem.className}
                            >
                                {linkItem.label || "My link"}
                            </Link>
                        ) : (
                            <a
                                className={linkItem.className}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (linkItem.onClick) {
                                        linkItem.onClick();
                                    }
                                }}
                            >
                                {linkItem.label || "My link"}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
