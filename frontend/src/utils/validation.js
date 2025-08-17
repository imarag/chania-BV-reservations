// Validate email format using regex
export function validate_email(email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = emailRegex.test(email);
    return isValid
        ? { isValid, error: null }
        : { isValid, error: "Invalid email format." };
}

// Validate password (6-15 alphanumeric characters)
export function validate_password(password) {
    const passwordRegex = /^[A-Za-z0-9]{6,15}$/;
    const isValid = passwordRegex.test(password);
    console.log(password, isValid)
    return isValid
        ? { isValid, error: null }
        : { isValid, error: "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character." };
}