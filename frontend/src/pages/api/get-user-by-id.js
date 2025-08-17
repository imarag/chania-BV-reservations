import { sendResponse } from "../../utils/response";
import { getUserById } from "../../utils/db-utils";

export async function GET({ params }) {
    const userId = await params.get("userId");
    const user = await getUserById(userId);
    return sendResponse({ user: user || null })
}