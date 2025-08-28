export default function NavItem({ className, children, ...attrs }) {
    const globalClass = `${className ? className : ""}`;
    return (
        <li className={globalClass} {...attrs}>
            {children}
        </li>
    );
}
