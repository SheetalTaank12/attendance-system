import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true }
});

const recordSchema = new mongoose.Schema({
  teacher: { type: String, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  students: [studentSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Record || mongoose.model("Record", recordSchema);
