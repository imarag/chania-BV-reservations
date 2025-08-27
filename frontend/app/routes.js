import { index, route } from "@react-router/dev/routes";
import { pagePaths } from "./utils/appUrls";

export default Object.keys(pagePaths).map((page) =>
    pagePaths[page].isHome
        ? index(`routes${pagePaths[page].path}/home.jsx`)
        : route(pagePaths[page].path, `routes/${page}.jsx`)
);
