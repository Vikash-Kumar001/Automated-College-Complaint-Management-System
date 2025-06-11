import mongoose from "mongoose";
const SupportRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("SupportRequest", SupportRequestSchema); 