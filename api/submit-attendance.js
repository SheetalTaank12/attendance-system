import { connectDB } from "../db.js";
import Code from "../models/Code.js";
import Record from "../models/Record.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  await connectDB();

  const { name, roll, className, code, date } = req.body;

  // Validate code
  const validCode = await Code.findOne({ code, className });
  if (!validCode) return res.status(400).json({ error: "Invalid code" });

  if (new Date() > validCode.expiresAt) {
    return res.status(400).json({ error: "Code expired" });
  }

  // Check if session exists
  const session = await Record.findOne({
    teacher: validCode.teacherName,
    className,
    subject: validCode.subject,
    date
  });

  if (session) {
    // Add student if not already added
    const exists = session.students.some(s => s.roll === roll);
    if (exists) return res.status(400).json({ error: "Attendance already submitted" });

    session.students.push({ name, roll });
    await session.save();
  } else {
    // Create new session
    await Record.create({
      teacher: validCode.teacherName,
      className,
      subject: validCode.subject,
      date,
      students: [{ name, roll }]
    });
  }

  res.json({
    message: `Attendance marked for ${validCode.subject} (${className})`
  });
}
