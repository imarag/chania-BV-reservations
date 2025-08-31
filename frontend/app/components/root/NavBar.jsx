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
import Button from "../ui/Button";
import { RiMenu3Line } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { PiCalendarDotsBold } from "react-icons/pi";
import { PiUsersBold } from "react-icons/pi";
import { FiLogIn } from "react-icons/fi";
import { PiNotePencil } from "react-icons/pi";
import { CgLogOut } from "react-icons/cg";

function UserMenu({ isMenuOpen}) {
    function handleLogout() {
        removeToken();
        window.location.replace(pagePaths.home.path);
    }
    const dropDownMenuLinks = [
        {
            label: pagePaths.account.name,
            path: pagePaths.account.path,
            page: true,
            className: "",
        },
        {
            label: pagePaths.schedule.name,
            path: pagePaths.schedule.path,
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
        <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer mt-auto">
            <DropDown menuLinks={dropDownMenuLinks} position="topRight">
                <Symbol IconComponent={PiUserCircleLight} />
                {isMenuOpen && <span>Account</span>}
            </DropDown>
        </NavItem>
    );
}

export default function NavBar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <nav
            className={`flex flex-col items-center h-full gap-12 px-4 pt-12 pb-4 text-white/60 relative ${isMenuOpen ? "w-60" : "w-auto"}`}
        >
            <Button
                variant="ghost"
                size="small"
                className={"absolute top-4 right-4"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <Symbol IconComponent={RiMenu3Line} />
            </Button>
            <div className="flex-none text-center mt-8 pb-4 border-b border-white/40">
                <Anchor href={pagePaths.home.path}>
                    <Logo />
                </Anchor>
                {isMenuOpen && (
                    <p className="text-xl text-center font-light my-2">
                        Beach Volley
                        <br /> Chania
                    </p>
                )}
            </div>
            <ul className={`grow flex flex-col ${isMenuOpen ? "items-start" : "items-center"} gap-6`}>
                <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer">
                    <Symbol IconComponent={IoHomeOutline} />
                    {isMenuOpen && (
                        <NavLink
                            name={pagePaths.home.name}
                            path={pagePaths.home.path}
                        />
                    )}
                </NavItem>
                <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer">
                    <Symbol IconComponent={PiCalendarDotsBold} />
                    {isMenuOpen && (
                        <NavLink
                            name={pagePaths.schedule.name}
                            path={pagePaths.schedule.path}
                        />
                    )}
                </NavItem>
                <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer">
                    <Symbol IconComponent={PiUsersBold} />
                    {isMenuOpen && (
                        <NavLink
                            name={pagePaths.users.name}
                            path={pagePaths.users.path}
                        />
                    )}
                </NavItem>
                {currentUser && currentUser.role == "admin" && (
                    <NavItem className="flex items-start gap-4 hover:text-base-content hover:cursor-pointer">
                        <Symbol IconComponent={RiMenu3Line} />
                        {isMenuOpen && (
                            <NavLink
                                name={pagePaths.admin.name}
                                path={pagePaths.admin.path}
                            />
                        )}
                    </NavItem>
                )}
                {!currentUser ? (
                    <>
                        <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer mt-auto">
                            <Symbol IconComponent={FiLogIn} />
                            {isMenuOpen && (
                                <NavLink
                                    name={pagePaths.login.name}
                                    path={pagePaths.login.path}
                                />
                            )}
                        </NavItem>
                        <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer">
                            <Symbol IconComponent={PiNotePencil} />
                            {isMenuOpen && (
                                <NavLink
                                    name={pagePaths.register.name}
                                    path={pagePaths.register.path}
                                    className={`${isMenuOpen ? "flex" : "hidden"}`}
                                />
                            )}
                        </NavItem>
                    </>
                ) : (
                    <div className="mt-auto">
                        <UserMenu isMenuOpen={isMenuOpen} />
                    </div>
                )}
            </ul>
        </nav>
    );
}
