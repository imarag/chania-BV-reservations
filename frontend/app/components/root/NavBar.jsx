import { pagePaths } from "../../utils/appUrls";
import Anchor from "../ui/Anchor";
import Logo from "../utils/Logo";

export default function NavBar() {
    const navLinks = Object.values(pagePaths).map((navItem) => (
        <li key={navItem.name} className={navItem.extraClassName}>
            <Anchor
                className="text-base-content/80 no-underline hover:text-base-content"
                href={navItem.path}
            >
                {navItem.name}
            </Anchor>
        </li>
    ));
    return (
        <nav className="flex items-center gap-12 px-8 py-4 bg-base-100 text-base relative">
            <Logo />
            <ul className="flex items-center flex-grow gap-4">{navLinks}</ul>
        </nav>
    );
}
