const SERVER = "http://localhost:4321";
const API = "/api";

const AppUrls = {
    SERVER,
    Protected: "/protected",
    API,
    AUTH: "/auth",
    HomePage: "/",
    AccountInfoPage: "/protected/account/info",
    AccountOrdersPage: "/protected/account/orders",
    AccountPage: "/protected/account",
    OrdersPage: "/protected/orders",
    RegisterAPI: SERVER + API + "/register",
    RegisterPage: "/auth/register",
    LoginAPI: SERVER + API + "/login",
    LoginPage: "/auth/login",
    LogoutAPI: SERVER + API + "/logout",
    GetSessionUserAPI: SERVER + API + "/get-session-user",
    GetUsersAPI: SERVER + API + "/get-users",
    searchAPI: SERVER + API + "/search"
};

export { AppUrls };