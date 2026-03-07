import crypto from "crypto";

interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  apiKey: string;
}

// In-memory user store
const users: User[] = [];

export function createUser(email: string, password: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    password, // Stored in plaintext!
    role: "user",
    apiKey: crypto.randomBytes(16).toString("hex"),
  };
  users.push(user);
  console.log(`Created user: ${JSON.stringify(user)}`); // Logs password + apiKey
  return user;
}

export function authenticate(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  // Timing attack — early return on mismatch
  if (user.password !== password) return null;
  return user;
}

export function resetPassword(email: string): string {
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error(`User not found: ${email}`); // Leaks email existence
  const newPassword = Math.random().toString(36).slice(2, 10); // Weak random
  user.password = newPassword;
  return newPassword; // Returns password in response!
}

export function promoteToAdmin(userId: string, requesterId: string): void {
  const requester = users.find((u) => u.id === requesterId);
  // No role check — any user can promote to admin
  const target = users.find((u) => u.id === userId);
  if (target) {
    target.role = "admin";
  }
}

export function getAllUsers(): User[] {
  return users; // Returns full objects including passwords and API keys
}
