import { createUser, getUserByEmail } from '../../utils/db-utils';
import { validate_email, validate_password } from '../../utils/validation';
import { encryptPassword, generateRandomId } from '../../utils/generic';
import { sendResponse } from "../../utils/response";
import { getUserByEmail } from "../../utils/db-utils";
import { delay } from '../../utils/generic';

export async function POST({ request }) {
    const data = await request.formData();
    const password = data.get("password")?.toString().trim() ?? null;
    const passwordConfirm = data.get("password-confirm")?.toString().trim() ?? null;
    const email = data.get("email")?.toString().trim() ?? null;
    console.log(password, email, passwordConfirm, "^^^^^^^**")
    if (!email || !password || !passwordConfirm) {
        return sendResponse({ message: "Missing required fields" }, 400);
    }

    if (!validate_email(email)) {
        return sendResponse({ message: "Invalid email format" }, 400);
    }

    if (password !== passwordConfirm) {
        return sendResponse({ message: "Passwords do not match" }, 400);
    }

    if (!validate_password(password)) {
        return sendResponse({ message: "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character." }, 400);
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return sendResponse({ message: "Email is already registered" }, 409);
        }

        const newUser = {
            email,
            password: password
        }
        await createUser(newUser);

        await delay(1500);

        return sendResponse({ message: "User added successfully!" }, 200);
    } catch (err) {
        console.error("Register error:", err);
        return sendResponse({ message: err.message || "Unknown error occurred" }, 500);
    }
}
