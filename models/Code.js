import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  code: String,
  className: String,
  subject: String,
  teacherName: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

export default mongoose.models.Code || mongoose.model("Code", codeSchema);
