import { useEffect, useState } from "react";
import { pagePaths } from "../../utils/appUrls";
import Logo from "../utils/Logo";
import Button from "../ui/Button";
import NavItem from "../utils/NavItem";
import NavLink from "../utils/NavLink";
import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import { useNavigate } from "react-router";
import { removeToken } from "../../utils/authentication";

export default function NavBar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        async function fetch_current_user() {
            const { resData, errorMessage } = await apiRequest({
                url: apiEndpoints.GET_CURRENT_USER,
                method: "get",
            });

            if (errorMessage) {
                setCurrentUser(null);
            }
            setCurrentUser(resData);
        }
        fetch_current_user();
    }, []);

    function handleLogout() {
        removeToken();
        window.location.replace(pagePaths.home.path);
    }

    return (
        <nav className="flex items-center gap-12 px-8 py-4 bg-base-100 text-base relative">
            <Logo />
            <ul className="flex items-center flex-grow gap-4">
                <NavItem>
                    <NavLink
                        name={pagePaths.home.name}
                        path={pagePaths.home.path}
                    />
                </NavItem>
                <NavItem>
                    <NavLink
                        name={pagePaths.schedule.name}
                        path={pagePaths.schedule.path}
                    />
                </NavItem>
                {!currentUser ? (
                    <>
                        <NavItem className="ms-auto">
                            <NavLink
                                name={pagePaths.login.name}
                                path={pagePaths.login.path}
                                className={"ms-auto"}
                            />
                        </NavItem>
                        <NavItem>
                            <NavLink
                                name={pagePaths.register.name}
                                path={pagePaths.register.path}
                            />
                        </NavItem>
                    </>
                ) : (
                    <>
                        <NavItem className="ms-auto">
                            <Button
                                size="small"
                                variant="ghost"
                                onClick={handleLogout}
                            >
                                {pagePaths.logout.name}
                            </Button>
                        </NavItem>
                    </>
                )}
            </ul>
        </nav>
    );
}
