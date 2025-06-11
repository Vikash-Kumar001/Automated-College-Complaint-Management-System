import User from "../../models/user.model.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({
    dest: path.join(process.cwd(), "uploads/"),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed!"));
    }
});

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const uploadProfilePic = [
    upload.single("profilePic"),
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            // Delete old pic if exists
            if (user.profilePic) {
                const oldPath = path.join(process.cwd(), "uploads", user.profilePic);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { profilePic: req.file.filename },
                { new: true, runValidators: false }
            );
            res.json({ message: "Profile picture updated", profilePic: updatedUser.profilePic });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
];

export const deleteProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.profilePic) {
            const picPath = path.join(process.cwd(), "uploads", user.profilePic);
            if (fs.existsSync(picPath)) fs.unlinkSync(picPath);
            user.profilePic = null;
            await user.save();
        }
        res.json({ message: "Profile picture deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        // Delete profile picture if exists
        if (user.profilePic) {
            const picPath = path.join(process.cwd(), "uploads", user.profilePic);
            if (fs.existsSync(picPath)) fs.unlinkSync(picPath);
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 