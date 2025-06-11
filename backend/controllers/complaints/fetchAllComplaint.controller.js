import Complaint from "../../models/complaint.model.js";

const fetchAllComplaint = async (req, res) => {
    try {
        const complaints = await Complaint.find({ resolverId: { $ne: null } })
            .populate("studentId", "fullName universityEnrollmentNo branch")
            .populate("resolverId", "fullName email");

        const formattedComplaints = complaints.map((complaint) => ({
            _id: complaint._id,
            fullName: complaint.studentId?.fullName || "N/A",
            universityEnrollmentNo: complaint.studentId?.universityEnrollmentNo || "N/A",
            complaintBranch: complaint.complaintBranch || "N/A",
            priorityLevel: complaint.priorityLevel || "Medium",
            description: complaint.description || "No Description",
            category: complaint.category || "General",
            studentId: complaint.studentId?._id || "N/A",
            resolverId: complaint.resolverId?._id || null,
            resolverName: complaint.resolverId?.fullName || "Unassigned",
            status: complaint.status || "Pending",
            file: complaint.file || null,
            createdAt: complaint.createdAt,
        }));

        res.json(formattedComplaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default fetchAllComplaint;
