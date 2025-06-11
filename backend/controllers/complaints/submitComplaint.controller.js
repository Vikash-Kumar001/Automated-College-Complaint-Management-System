import Complaint from "../../models/complaint.model.js";
import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";
import { sendEmail } from "../../utils/email.js";

export const submitComplaint = async (req, res) => {
    try {
        console.log("📩 Complaint Submission Request:", req.body);
        console.log("🔹 User Data from Token:", req.user); // Debugging log

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized! Please log in." });
        }

        const { username, uid, inCharge, branch, priority, description } = req.body;
        const file = req.file ? req.file.filename : null;

        if (!username || !uid || !inCharge || !branch || !priority || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newComplaint = new Complaint({
            fullName: username,
            universityEnrollmentNo: uid,
            complaintBranch: branch,
            priorityLevel: priority,
            description,
            category: inCharge,
            studentId: req.user.userId,
            status: "pending",
            file,
        });

        await newComplaint.save();

        // Notify all admins (in-app)
        const admins = await User.find({ role: "admin" });
        const notifications = admins.map(admin => ({
            userId: admin._id,
            message: `New complaint submitted: ${username}`,
            link: `/admin-dashboard/complaints`,
        }));
        await Notification.insertMany(notifications);

        // Email all admins
        const adminEmails = admins.map(a => a.email).filter(Boolean);
        if (adminEmails.length === 0) {
            console.error("[EMAIL ERROR] No admin emails found in the database. Cannot send notification.");
        } else {
            try {
                console.log("[EMAIL DEBUG] Attempting to send admin email to:", adminEmails);
                await sendEmail({
                    to: adminEmails.join(","),
                    subject: "New Complaint Submitted",
                    text: `A new complaint has been submitted by ${username} (Enrollment: ${uid}).\n\nBranch: ${branch}\nPriority: ${priority}\nDescription: ${description}\n\nLogin to the admin dashboard to view details.`,
                    html: `<p>A new complaint has been submitted by <b>${username}</b> (Enrollment: ${uid}).</p><ul><li><b>Branch:</b> ${branch}</li><li><b>Priority:</b> ${priority}</li><li><b>Description:</b> ${description}</li></ul><p><a href="${process.env.ADMIN_DASHBOARD_URL || "http://localhost:3000/admin-dashboard/complaints"}">View in Admin Dashboard</a></p>`
                });
                console.log("[EMAIL DEBUG] Admin email sent successfully.");
            } catch (emailError) {
                console.error("[EMAIL ERROR] Failed to send admin email:", emailError.message, emailError);
            }
        }

        return res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
    } catch (error) {
        console.error("❌ Error submitting complaint:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default submitComplaint;

