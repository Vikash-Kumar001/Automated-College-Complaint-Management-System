import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["student", "teacher", "resolver", "admin"], default: "student" },
        branch: { type: String, required: function() { return this.role !== 'admin'; }, default: null },
        enrollment: { type: String, required: true },
        profilePic: { type: String, default: null },
    },
    { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
