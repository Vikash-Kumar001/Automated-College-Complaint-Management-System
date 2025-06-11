import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
