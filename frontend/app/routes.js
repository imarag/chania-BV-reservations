import { index, route, layout } from "@react-router/dev/routes";
import { pagePaths } from "./utils/appUrls";

// filter pages that do not exist (e.g. logout page) and the home page (specidal index below)
// and transform into a list of page objects
const pages = Object.keys(pagePaths)
  .filter((pageKey) => pagePaths[pageKey]?.path || pagePaths[pageKey] === "/")
  .map((pageKey) => pagePaths[pageKey]);

// get the home page
const homePage = Object.keys(pagePaths).find(
  (pageKey) => pagePaths[pageKey]?.path === "/"
);

// public vs protected
const publicPages = pages.filter((page) => !page.requiresAuth);
const protectedPages = pages.filter((page) => page.requiresAuth);

// build routes
const publicRoutes = publicPages.map((page) =>
  route(page.path, `./routes/${page.route}.jsx`)
);
const protectedRoutes = protectedPages.map((page) =>
  route(page.path, `./routes/${page.route}.jsx`)
);

// final config
export default [
  index(`./routes/${homePage.route}.jsx`),
  ...publicRoutes,
  layout("./components/utils/ProtectedPage.jsx", protectedRoutes),
];
