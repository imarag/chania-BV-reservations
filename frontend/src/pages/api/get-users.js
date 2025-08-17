import { sendResponse } from "../../utils/response";
import { getAllUsers } from "../../utils/db-utils";

export async function GET(context) {
    const users = await getAllUsers();
    return sendResponse(users)
};