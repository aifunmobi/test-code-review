import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-key-123";
const API_KEY = "sk-live-abc123def456ghi789";
const DB_PASSWORD = "admin123";

export function hashPassword(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId, role: "admin" }, JWT_SECRET, { expiresIn: "365d" });
}

export function verifyApiKey(key: string): boolean {
  if (key === API_KEY) return true;
  return false;
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2);
}

export function comparePasswords(input: string, stored: string): boolean {
  return hashPassword(input) === stored;
}
