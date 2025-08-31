import { useEffect, useState } from "react";
import { pagePaths } from "../../utils/appUrls";
import Logo from "../utils/Logo";
import Anchor from "../ui/Anchor";
import NavItem from "../utils/NavItem";
import NavLink from "../utils/NavLink";
import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import { useNavigate } from "react-router";
import { removeToken } from "../../utils/authentication";
import DropDown from "../ui/DropDown";
import { PiUserCircleLight } from "react-icons/pi";
import Symbol from "../ui/Symbol";

function UserMenu() {
    function handleLogout() {
        removeToken();
        window.location.replace(pagePaths.home.path);
    }
    {
        /* <li>
                <Anchor
                    href={pagePaths.account.path}
                    className="no-underline text-base-content hover:text-base-content"
                >
                    {pagePaths.account.name}
                </Anchor>
            </li>
            <li className="text-error">
                <a onClick={handleLogout}>Logout</a>
            </li> */
    }
    const dropDownMenuLinks = [
        {
            label: pagePaths.account.name,
            path: pagePaths.account.path,
            page: true,
            className: "",
        },
        {
            label: pagePaths.logout.name,
            path: "",
            page: false,
            onClick: handleLogout,
            className: "text-error",
        },
    ];
    return (
        <DropDown menuLinks={dropDownMenuLinks} position="bottomLeft">
            <Symbol className="font-light" IconComponent={PiUserCircleLight} />
        </DropDown>
        // <div>
        //     <NavItem className="ms-auto">
        //         <Button size="small" variant="ghost" onClick={handleLogout}>
        //             {pagePaths.logout.name}
        //         </Button>
        //     </NavItem>
        // </div>
    );
}

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
                <NavItem>
                    <NavLink
                        name={pagePaths.users.name}
                        path={pagePaths.users.path}
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
                    <div className="ms-auto">
                        <UserMenu />
                    </div>
                )}
            </ul>
        </nav>
    );
}
