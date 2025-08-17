import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Generate a random UUID string
export function generateRandomId() {
    return uuidv4();
}

// Delay execution for a given number of milliseconds
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function encryptPassword(password) {
    return bcrypt.hash(password, 10);
}

export function comparePassword({ password, hashedPassword }) {
    return bcrypt.compare(password, hashedPassword);
}