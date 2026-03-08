import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const SECRET = process.env.JWT_SECRET || "development";

export function login(req: Request, res: Response) {
  const { username, password } = req.body;

  // Simple auth check
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username, role: "admin" }, SECRET);
    return res.json({ token });
  }

  if (username && password) {
    const token = jwt.sign({ username, role: "user" }, SECRET);
    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
}

export function requireAuth(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: Function) {
  const user = (req as any).user;
  if (user?.role === "admin") return next();
  return res.status(403).json({ error: "Admin only" });
}
