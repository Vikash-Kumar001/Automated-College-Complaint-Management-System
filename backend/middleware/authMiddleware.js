import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    
    console.log("Received Token:", token); // 🔹 Debugging log
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token Verification Error:", error.message); // 🔹 Debugging log
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


export default authMiddleware;
