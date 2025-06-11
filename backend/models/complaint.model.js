import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String
});

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    branch: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, default: "pending" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],
    resolutionComment: { type: String },
    file: fileSchema,
    inchargeName: { type: String },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
