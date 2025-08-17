import { sendResponse } from "../../utils/response";
import { getUserByEmail } from "../../utils/db-utils";
import bcrypt from "bcryptjs";
import { delay } from "../../utils/generic";

export async function POST({ session, request }) {
  const data = await request.formData();

  const password = data.get("password")?.toString() ?? null;
  const email = data.get("email")?.toString() ?? null;

  if (!email || !password) {
    return sendResponse({ message: "Missing required fields" }, 400);
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return sendResponse({ message: `User with email ${email} does not exist.` }, 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return sendResponse({ message: "Incorrect password." }, 401);
    }

    await session.set('user', { id: user.id, email: user.email });
    console.warn(`Session created for user ${user.email}`);

    await delay(1500);

    return sendResponse({ message: "Login successful!" }, 200);
  } catch (err) {
    console.error("Login error:", err);
    return sendResponse({ message: err.message || "Internal server error." }, 500);
  }
}
