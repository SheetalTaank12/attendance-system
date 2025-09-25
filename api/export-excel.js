import { connectDB } from "../db.js";
import Record from "../models/Record.js";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Only GET allowed");

  await connectDB();

  const { className, subject, date } = req.query;

  // Find the session for that class, subject, and date
  const session = await Record.findOne({ className, subject, date }).lean();
  if (!session) return res.status(404).json({ error: "No attendance found for this date" });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance");

  // Add session info at top
  sheet.addRow(["Teacher", session.teacher]);
  sheet.addRow(["Class", session.className]);
  sheet.addRow(["Subject", session.subject]);
  sheet.addRow(["Date", session.date]);
  sheet.addRow([]); // empty row

  // Add student header
  sheet.addRow(["Roll", "Name"]);

  // Add students
  session.students.forEach(s => {
    sheet.addRow([s.roll, s.name]);
  });

  // Auto-fit columns
  sheet.columns.forEach(col => {
    let maxLength = 0;
    col.eachCell({ includeEmpty: true }, cell => {
      const value = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, value.length);
    });
    col.width = maxLength + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${className}_${subject}_${date}.xlsx`
  );
  res.send(Buffer.from(buffer));
}
