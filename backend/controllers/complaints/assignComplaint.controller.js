import Complaint from "../../models/complaint.model.js";
import User from "../../models/user.model.js";
import Notification from "../../models/notification.model.js";
import { sendEmail } from "../../utils/email.js";

export const assignComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { resolverId } = req.body;

        if (!resolverId) return res.status(400).json({ message: "Resolver ID is required." });

        const resolver = await User.findById(resolverId);
        if (!resolver) return res.status(404).json({ message: "Resolver not found." });

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { resolverId, status: "in progress" }, 
            { new: true }
        );

        if (!updatedComplaint) return res.status(404).json({ message: "Complaint not found." });

        // Notify the resolver (in-app)
        await Notification.create({
            userId: resolverId,
            message: `A complaint has been forwarded to you (ID: ${complaintId})`,
            link: `/resolver-dashboard/complaints`,
        });

        // Email the resolver
        if (resolver.email) {
            await sendEmail({
                to: resolver.email,
                subject: "New Complaint Assigned to You",
                text: `A complaint (ID: ${complaintId}) has been forwarded to you.\n\nPlease log in to the resolver dashboard to view and take action.`,
                html: `<p>A complaint (ID: <b>${complaintId}</b>) has been forwarded to you.</p><p><a href="${process.env.RESOLVER_DASHBOARD_URL || "http://localhost:3000/resolver-dashboard/complaints"}">View in Resolver Dashboard</a></p>`
            });
        }

        res.status(200).json({ message: "Complaint assigned successfully", complaint: updatedComplaint });
    } catch (error) {
        console.error("❌ Error assigning complaint:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default assignComplaint;
