import { AppUrls } from "./utils/enumerators";
import sendResponse from "./utils/response";

export async function onRequest(context, next) {
    const currURL = context.url.pathname;
    if (currURL.includes(AppUrls.Protected)) {
        const user = await context.session?.get('user');
        if (!user) {
            // Redirect to login if not authenticated
            console.warn('No session found, redirecting to login');
            return sendResponse({ message: null, status: 303, redirectTo: AppUrls.LoginPage });
        }
        console.warn(`Session found, user email: ${user.email}`);
    }

    return next();
}