import { sendResponse } from "../../utils/response";

export async function GET({ session }) {
    const user = await session?.get('user') || null;
    if (user) {
        return sendResponse({ loggedIn: true, user })
    } else {
        return sendResponse({ loggedIn: false, user })
    }
}