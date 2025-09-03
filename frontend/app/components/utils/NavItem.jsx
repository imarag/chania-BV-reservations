export default function NavItem({ className, children, ...attrs }) {
    const globalClass = `flex items-center gap-4 hover:text-base-content hover:cursor-pointer ${className ? className : ""}`;
    return (
        <li className={globalClass} {...attrs}>
            {children}
        </li>
    );
}
