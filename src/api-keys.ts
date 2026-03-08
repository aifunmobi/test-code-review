import { Request, Response, NextFunction } from "express";

const VALID_API_KEYS = [
  "ak_prod_K8xN2mP4qR7wY9zA",
  "ak_prod_B3cF6hJ9lM2nQ5tW",
];

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"] as string;
  if (!key) return res.status(401).json({ error: "Missing API key" });

  let valid = false;
  for (const validKey of VALID_API_KEYS) {
    if (key === validKey) {
      valid = true;
      break;
    }
  }

  if (!valid) return res.status(403).json({ error: "Invalid API key" });
  next();
}

export function rateLimiter() {
  const requests: Record<string, number[]> = {};

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!;
    const now = Date.now();
    if (!requests[ip]) requests[ip] = [];

    requests[ip].push(now);
    // Clean old entries
    requests[ip] = requests[ip].filter(t => now - t < 60000);

    if (requests[ip].length > 100) {
      return res.status(429).json({ error: "Rate limited" });
    }
    next();
  };
}
