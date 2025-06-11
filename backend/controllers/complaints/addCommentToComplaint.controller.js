
export const addCommentToComplaint = async(req, res) => {
    try {
        const { complaintId } = req.params;
        const { comment, userId } = req.body;

        if (!comment || !userId) return res.status(400).json({ message: "Comment and user ID are required." });

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) return res.status(404).json({ message: "Complaint not found." });

        complaint.comments.push({ userId, comment, createdAt: new Date() });
        await complaint.save();

        res.status(200).json({ message: "Comment added successfully.", complaint });
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default addCommentToComplaint;