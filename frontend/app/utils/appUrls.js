export const pagePaths = {
    home: {
        name: "Home",
        path: "/",
        extraClassName: "",
        isHome: true,
        isPage: true,
    },
    schedule: {
        name: "Schedule",
        path: "/schedule",
        extraClassName: "",
        isHome: false,
        isPage: true,
    },
    login: {
        name: "Login",
        path: "/auth/login",
        extraClassName: "ms-auto",
        isHome: false,
        isPage: true,
    },
    register: {
        name: "Register",
        path: "/auth/register",
        extraClassName: "",
        isHome: false,
        isPage: true,
    },
    logout: {
        name: "Logout",
        extraClassName: "",
        isHome: false,
        isPage: false,
    },
};

const serverUrl = "http://localhost:8000";
const baseApiUrl = `${serverUrl}/api`;
const baseAuthUrl = `${baseApiUrl}/auth`;
const baseDBUrl = `${baseApiUrl}/db`;

export const apiEndpoints = {
    LOGIN_USER: `${baseAuthUrl}/login`,
    REGISTER_USER: `${baseAuthUrl}/register`,
    LOGOUT_USER: `${baseAuthUrl}/logout`,
    GET_CURRENT_USER: `${baseAuthUrl}/get-current-user`,
    GET_SCHEDULE: `${baseApiUrl}/schedule`,
    GET_BOOKING_CELLS: `${baseDBUrl}/get-booking-cells`,
};
