import { sendResponse } from "../../utils/response";
import { getAllProducts } from "../../utils/db-utils";

export async function GET(context) {
    const products = await getAllProducts();
    const searchParam = context.url.searchParams.get("q") || "";

    if (!searchParam) {
        return sendResponse({ products: [] });
    }

    const searchParamProcessed = searchParam.trim().toLowerCase();
    const filteredProducts = products.filter(product => {
        return product.title.toLowerCase().trim().includes(searchParamProcessed) ||
            product.description.toLowerCase().trim().includes(searchParamProcessed);
    });
    return sendResponse({ products: filteredProducts });
};