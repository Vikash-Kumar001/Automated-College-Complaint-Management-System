import Complaint from "../../models/complaint.model.js"; 

export const deleteComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params; 
        const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

        if (!deletedComplaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting complaint:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default deleteComplaint;
