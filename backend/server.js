import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import { EventEmitter } from "events";
import mongoose from "mongoose";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

EventEmitter.defaultMaxListeners = 50;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    });

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected Successfully");
});
mongoose.connection.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});
mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB Disconnected. Attempting to reconnect...");
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => console.error("Reconnection Failed:", err));
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

export default app;