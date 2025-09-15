import { useEffect, useState } from "react";
import { pagePaths } from "../../utils/appUrls";
import Logo from "../utils/Logo";
import Anchor from "../ui/Anchor";
import NavItem from "../utils/NavItem";
import NavLink from "../utils/NavLink";
import { apiEndpoints } from "../../utils/appUrls";
import { apiRequest } from "../../utils/apiRequest";
import { useNavigate } from "react-router";
import DropDown from "../ui/DropDown";
import { PiUserCircleLight } from "react-icons/pi";
import Symbol from "../ui/Symbol";
import Button from "../ui/Button";
import { IoHomeOutline } from "react-icons/io5";
import { PiCalendarDotsBold } from "react-icons/pi";
import { PiUsersBold } from "react-icons/pi";
import { FiLogIn } from "react-icons/fi";
import { PiNotePencil } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { GrUserAdmin } from "react-icons/gr";
import { CgLogOut } from "react-icons/cg";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useNotification } from "../../context/NotificationContext";

function UserMenu({ isMenuOpen }) {
  const { setCurrentUser } = useCurrentUser();
  const { showNotification } = useNotification();

  async function handleLogout() {
    const { resData, resError } = await apiRequest({
      url: apiEndpoints.LOGOUT_USER,
      method: "POST",
    });

    if (resError) {
      showNotification("Logout failed!");
      return;
    }

    setCurrentUser(null);
    window.location.replace(pagePaths.home.path);
  }
  const dropDownMenuLinks = [
    {
      label: pagePaths.account.name,
      path: pagePaths.account.path,
      icon: IoPersonOutline,
      page: true,
      className: "",
    },
    {
      label: pagePaths.schedule.name,
      path: pagePaths.schedule.path,
      icon: PiCalendarDotsBold,
      page: true,
      className: "",
    },
    {
      label: pagePaths.logout.name,
      path: "",
      icon: CgLogOut,
      page: false,
      onClick: handleLogout,
      className: "text-error",
    },
  ];
  return (
    <NavItem>
      <NavLink>
        <DropDown menuLinks={dropDownMenuLinks} position="topRight">
          <Symbol IconComponent={PiUserCircleLight} />
          {isMenuOpen && "Account"}
        </DropDown>
      </NavLink>
    </NavItem>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    async function fetch_current_user() {
      const { resData, resError } = await apiRequest({
        url: apiEndpoints.GET_CURRENT_USER,
        method: "get",
      });

      if (resError) {
        setCurrentUser(null);
      }
      setCurrentUser(resData);
    }
    fetch_current_user();
  }, []);

  return (
    <nav
      className={`flex-none flex flex-col items-center h-full gap-8 ${
        isMenuOpen ? "w-64" : "w-auto"
      } pb-8 relative container mx-auto text-base-content/60 px-4`}
    >
      <div
        className={`flex-none flex flex-col items-center text-center mt-20 gap-4`}
      >
        <Anchor href={pagePaths.home.path} className={"flex-none"}>
          <Logo />
        </Anchor>
        <p className="text-start text-xl font-semibold ">
          {isMenuOpen ? "Chania B.V." : "C.B.V"}
        </p>
      </div>
      <hr className="border-t border-white/8 border-1 w-3/4 mx-auto" />
      <ul
        className={`grow flex flex-col ${
          isMenuOpen ? "items-start" : "items-center"
        } gap-6`}
      >
        <NavItem>
          <NavLink path={pagePaths.home.path}>
            <>
              <Symbol IconComponent={IoHomeOutline} />
              {isMenuOpen && pagePaths.home.name}
            </>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink path={pagePaths.schedule.path}>
            <>
              <Symbol IconComponent={PiCalendarDotsBold} />
              {isMenuOpen && pagePaths.schedule.name}
            </>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink path={pagePaths.users.path}>
            <>
              <Symbol IconComponent={PiUsersBold} />
              {isMenuOpen && pagePaths.users.name}
            </>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink path={pagePaths.rules.path}>
            <>
              <Symbol IconComponent={MdOutlineLibraryBooks} />
              {isMenuOpen && pagePaths.rules.name}
            </>
          </NavLink>
        </NavItem>
        {currentUser && currentUser.role == "admin" && (
          <NavItem className="flex items-start gap-4 hover:text-base-content hover:cursor-pointer">
            <NavLink path={pagePaths.admin.path}>
              <>
                <Symbol IconComponent={GrUserAdmin} />
                {isMenuOpen && pagePaths.admin.name}
              </>
            </NavLink>
          </NavItem>
        )}
        {!currentUser ? (
          <>
            <NavItem className="flex items-center gap-4 hover:text-base-content hover:cursor-pointer mt-auto">
              <NavLink path={pagePaths.login.path}>
                <>
                  <Symbol IconComponent={FiLogIn} />
                  {isMenuOpen && pagePaths.login.name}
                </>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink path={pagePaths.register.path}>
                <>
                  <Symbol IconComponent={PiNotePencil} />
                  {isMenuOpen && pagePaths.register.name}
                </>
              </NavLink>
            </NavItem>
          </>
        ) : (
          <div className="ms-auto md:mt-auto">
            <UserMenu isMenuOpen={isMenuOpen} />
          </div>
        )}
      </ul>
      <Button
        variant="ghost"
        size="small"
        className={`absolute top-4 ${isMenuOpen ? "right-4" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <Symbol IconComponent={IoClose} />
        ) : (
          <Symbol IconComponent={HiMenu} />
        )}
      </Button>
    </nav>
  );
}
