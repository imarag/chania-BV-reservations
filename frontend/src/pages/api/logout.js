import { AppUrls } from "../../utils/enumerators";
import { sendResponse } from "../../utils/response";

export async function GET({ session }) {
    const user = await session.get("user");
    if (user) {
        console.warn("Destroying session...")
        session.destroy();
    }
    return sendResponse(null, 302, AppUrls.HomePage);
}
