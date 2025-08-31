export const pagePaths = {
    home: {
        name: "Home",
        path: "/",
        isHome: true,
        isPage: true,
    },
    schedule: {
        name: "Schedule",
        path: "/schedule",
        isHome: false,
        isPage: true,
    },
    login: {
        name: "Login",
        path: "/auth/login",
        isHome: false,
        isPage: true,
    },
    register: {
        name: "Register",
        path: "/auth/register",
        isHome: false,
        isPage: true,
    },
    logout: {
        name: "Logout",
        isHome: false,
        isPage: false,
    },
    users: {
        name: "Players",
        path: "/users",
        isHome: false,
        isPage: true,
    },
    account: {
        name: "Account",
        path: "/acount",
        isHome: false,
        isPage: true,
    },
    admin: {
        name: "Admin",
        path: "/admin",
        isHome: false,
        isPage: true,
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
    GET_ALL_USERS: `${baseDBUrl}/users`,
    GET_CURRENT_USER: `${baseAuthUrl}/get-current-user`,
    UPDATE_USER_INFO: `${baseDBUrl}/update-user-info?user_id=:id`,
    DELETE_USER: `${baseDBUrl}/delete-user?user_id=:id`,
};
