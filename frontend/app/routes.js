import { index, route } from "@react-router/dev/routes";
import { pagePaths } from "./utils/appUrls";

export default Object.keys(pagePaths)
.filter((page) => pagePaths[page].isPage)
.map((page) =>
    pagePaths[page].isHome
        ? index(`routes${pagePaths[page].path}/home.jsx`)
        : route(pagePaths[page].path, `routes/${page}.jsx`)
);
