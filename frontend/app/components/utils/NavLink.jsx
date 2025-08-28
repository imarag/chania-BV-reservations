import Anchor from "../ui/Anchor";

export default function NavLink({ name, path, className }) {
    const globalClass = `text-base-content/80 no-underline hover:text-base-content ${className}`;
    return (
        <Anchor className={globalClass} href={path}>
            {name}
        </Anchor>
    );
}
