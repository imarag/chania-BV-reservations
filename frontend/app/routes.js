import { index, route } from "@react-router/dev/routes";
import { pagePaths } from "./utils/appUrls";

export default Object.keys(pagePaths)
    .filter((page) => pagePaths[page].isPage)
    .map((page) => {
        const pathWithoutQuery = pagePaths[page].path.split("?")[0]; // remove query params
        return pagePaths[page].isHome
            ? index(`routes${pathWithoutQuery}/home.jsx`)
            : route(pathWithoutQuery, `routes/${page}.jsx`);
    });
