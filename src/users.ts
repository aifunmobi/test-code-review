import { MongoClient } from "mongodb";
import { Request, Response } from "express";

const client = new MongoClient("mongodb://localhost:27017");
const db = client.db("app");

export async function findUser(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await db.collection("users").findOne({ username, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ id: user._id, username: user.username, email: user.email });
}

export async function searchUsers(req: Request, res: Response) {
  const { filter } = req.query;
  const query = JSON.parse(filter as string);
  const users = await db.collection("users").find(query).toArray();
  return res.json(users);
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.params.id;
  const updates = req.body;
  await db.collection("users").updateOne({ _id: userId }, { $set: updates });
  return res.json({ ok: true });
}

export async function deleteUser(req: Request, res: Response) {
  const { username } = req.body;
  await db.collection("users").deleteMany({ username });
  return res.json({ deleted: true });
}
