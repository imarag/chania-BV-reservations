export const pagePaths = {
  home: { name: "Home", route: "home", path: "/" },
  schedule: { name: "Schedule", route: "schedule", path: "/schedule" },
  login: { name: "Login", route: "login", path: "/auth/login" },
  register: { name: "Register", route: "register", path: "/auth/register" },
  logout: { name: "Logout", route: null, path: null },
  users: {
    name: "Players",
    route: "users",
    path: "/users",
  },
  account: {
    name: "Account",
    route: "account",
    path: "/account",
    requiresAuth: true,
  },
  admin: {
    name: "Admin",
    route: "admin",
    path: "/admin",
    requiresAuth: true,
  },
  reserve: {
    name: "Reserve",
    route: "reserve",
    path: "/reserve",
    requiresAuth: true,
  },
  rules: { name: "Rules", route: "rules", path: "/rules" },
};

const DEFAULT_API_URL = "http://localhost:8000";
export const SERVER_URL =
  (typeof window !== "undefined" && window.__APP_API_URL__) ||
  import.meta.env?.VITE_API_URL ||
  DEFAULT_API_URL;

const API = new URL("/api/", SERVER_URL);
const AUTH = new URL("auth/", API);
const DB = new URL("db/", API);

const u = (base, path) => new URL(path, base).href;

export const apiEndpoints = {
  LOGIN_USER: u(AUTH, "login"),
  REGISTER_USER: u(AUTH, "register"),
  LOGOUT_USER: u(AUTH, "logout"),
  GET_CURRENT_USER: u(AUTH, "get-current-user"),
  IS_USER_ADMIN: u(AUTH, "is-user-admin"),

  GET_SCHEDULE: u(API, "schedule"),
  GET_BOOKING_CELLS: u(DB, "get-booking-cells"),
  GET_ALL_USERS: u(DB, "users"),
  UPDATE_USER_INFO: (id) =>
    u(DB, `update-user-info?user_id=${encodeURIComponent(id)}`),
  DELETE_USER: (id) => u(DB, `delete-user?user_id=${encodeURIComponent(id)}`),
  CREATE_RESERVATION: u(DB, "create-reservation"),
};
