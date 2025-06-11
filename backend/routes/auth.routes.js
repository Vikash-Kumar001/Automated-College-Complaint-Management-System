import express from "express";
import { loginUser } from "../controllers/auth/login.controller.js"; // ✅ Ensure correct path
import { registerUser } from "../controllers/auth/register.controller.js"; // ✅ Ensure correct path
import { getUserProfile, uploadProfilePic, deleteProfilePic, deleteUser } from "../controllers/auth/profile.controller.js";

const router = express.Router();

// ✅ User Registration Route
router.post("/register", registerUser);

// ✅ User Login Route
router.post("/login", loginUser);

router.get("/profile/:id", getUserProfile);
router.post("/profile/:id/picture", uploadProfilePic);
router.delete("/profile/:id/picture", deleteProfilePic);
router.delete("/profile/:id", deleteUser);

export default router;
