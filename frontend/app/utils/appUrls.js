export const pagePaths = {
    home: {
        name: "Home",
        path: "/",
        extraClassName: "",
        isHome: true,
    },
    schedule: {
        name: "Schedule",
        path: "/schedule",
        extraClassName: "",
        isHome: false,
    },
    login: {
        name: "Login",
        path: "/auth/login",
        extraClassName: "ms-auto",
        isHome: false,
    },
    register: {
        name: "Register",
        path: "/auth/register",
        extraClassName: "",
        isHome: false,
    },
};

const serverUrl = "http://localhost:8000";
const baseApiUrl = `${serverUrl}/api`;
const baseAuthUrl = `${baseApiUrl}/auth`;

export const apiEndpoints = {
    LOGIN_USER: `${baseAuthUrl}/login`,
    REGISTER_USER: `${baseAuthUrl}/register`,
    LOGOUT_USER: `${baseAuthUrl}/logout`,
    GET_SCHEDULE: `${baseApiUrl}/schedule`,
};
