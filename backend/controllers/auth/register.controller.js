import User from "../../models/user.model.js"; // ✅ Ensure correct import
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        console.log("📩 Received Registration Request:", req.body);

        const { name, email, enrollment, password, role, branch } = req.body;

        // ✅ Validate Required Fields
        if (!name || !email || !password || !role || !enrollment || !branch) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Ensure Enrollment is required **only for students**
        if (role === "student" && !enrollment) {
            return res.status(400).json({ message: "Enrollment number is required for students." });
        }

        // ✅ Normalize Email (Avoid case-sensitive duplicates)
        const normalizedEmail = email.toLowerCase();

        // ✅ Ensure Strong Password (Minimum 6 Characters)
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Ensure We Are Using the User Model (NOT Complaint)
        const branchToSave = role === "admin" ? null : branch;
        const newUser = new User({
            name,
            email: normalizedEmail,
            enrollment,
            branch: branchToSave,
            password: hashedPassword,
            role
        });

        await newUser.save();
        console.log("✅ User Registered Successfully:", { userId: newUser._id, role: newUser.role });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                enrollment: newUser.enrollment,
                branch: newUser.branch
            }
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Future Implematation --->

// import User from "../../models/user.model.js";
// import bcrypt from "bcryptjs";

// export const registerUser = async (req, res) => {
//     try {
//         console.log("📩 Received Registration Request:", req.body);

//         const {
//             name,
//             email,
//             password,
//             role,
//             username,
//             enrollment,
//             teacherId,
//             branch
//         } = req.body;

//         // Basic field validation
//         if (!name || !email || !password || !role || !username) {
//             return res.status(400).json({ message: "All required fields must be provided." });
//         }

//         // Role-specific field checks
//         if (role === "student" && !enrollment) {
//             return res.status(400).json({ message: "Enrollment number is required for students." });
//         }

//         if (role === "teacher" && !teacherId) {
//             return res.status(400).json({ message: "Teacher ID is required for teachers." });
//         }

//         // Branch is required for student or teacher
//         if ((role === "student" || role === "teacher") && !branch) {
//             return res.status(400).json({ message: "Branch is required for students and teachers." });
//         }

//         const normalizedEmail = email.toLowerCase();

//         // Check for duplicate email or username
//         const existingEmail = await User.findOne({ email: normalizedEmail });
//         if (existingEmail) {
//             return res.status(400).json({ message: "Email is already registered." });
//         }

//         const existingUsername = await User.findOne({ username });
//         if (existingUsername) {
//             return res.status(400).json({ message: "Username is already taken." });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ message: "Password must be at least 6 characters." });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name,
//             email: normalizedEmail,
//             username,
//             password: hashedPassword,
//             role,
//             enrollment: role === "student" ? enrollment : undefined,
//             teacherId: role === "teacher" ? teacherId : undefined,
//             branch: (role === "student" || role === "teacher") ? branch : undefined
//         });

//         await newUser.save();

//         console.log("✅ User registered:", {
//             userId: newUser._id,
//             role: newUser.role
//         });

//         res.status(201).json({
//             message: "User registered successfully",
//             user: {
//                 _id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role
//             }
//         });

//     } catch (error) {
//         console.error("❌ Registration error:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

