import { connectDB } from "../db.js";
import Code from "../models/Code.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    await connectDB();

    const { className, subject, teacherName } = req.body;
    if (!className || !subject || !teacherName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 60 * 1000); // 1 min

    await Code.create({ code, className, subject, teacherName, createdAt, expiresAt });

    return res.json({ code, validFor: "1 minute" });
  } catch (err) {
    console.error("Error in /api/generate-code:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
