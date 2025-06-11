import Complaint from "../../models/complaint.model.js";

export const submitComplaint = async (req, res) => {
  try {
    const { title, description, branch, category, priority, inchargeName } = req.body;
    const file = req.file
      ? { filename: req.file.filename, originalname: req.file.originalname }
      : null;

    if (!title || !description || !branch || !category || !priority) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    const newComplaint = new Complaint({
      title,
      description,
      branch,
      category,
      priority,
      inchargeName,
      studentId: req.user.userId,
      status: "pending",
      file,
    });

    await newComplaint.save();
    res
      .status(201)
      .json({
        message: "Complaint submitted successfully",
        complaint: newComplaint,
      });
  } catch (error) {
    console.error("❌ Error submitting complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const complaints = await Complaint.find(query).populate(
      "studentId",
      "name email role branch enrollment"
    );
    res.status(200).json(complaints);
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const fetchComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate(
      "studentId",
      "name email role branch enrollment"
    );

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json(complaint);
  } catch (error) {
    console.error("❌ Error fetching complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolverId } = req.body;

    if (!resolverId)
      return res.status(400).json({ message: "Resolver ID is required" });

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { resolverId, status: "forwarded" },
      { new: true }
    );

    if (!updatedComplaint)
      return res.status(404).json({ message: "Complaint not found" });

    res
      .status(200)
      .json({
        message: "Complaint forwarded successfully",
        complaint: updatedComplaint,
      });
  } catch (error) {
    console.error("❌ Error assigning complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addCommentToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment)
      return res.status(400).json({ message: "Comment cannot be empty" });

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $push: { comments: { text: comment, createdAt: new Date() } } },
      { new: true }
    );

    if (!updatedComplaint)
      return res.status(404).json({ message: "Complaint not found" });

    res
      .status(200)
      .json({
        message: "Comment added successfully",
        complaint: updatedComplaint,
      });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionComment } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status: "resolved", resolutionComment },
      { new: true }
    );

    if (!updatedComplaint)
      return res.status(404).json({ message: "Complaint not found" });

    res
      .status(200)
      .json({
        message: "Complaint resolved successfully",
        complaint: updatedComplaint,
      });
  } catch (error) {
    console.error("❌ Error resolving complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting complaint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const fetchResolverStats = async (req, res) => {
  try {
    const { resolverId } = req.params;
    const total = await Complaint.countDocuments({ resolverId });
    const resolved = await Complaint.countDocuments({
      resolverId,
      status: "resolved",
    });
    const pending = await Complaint.countDocuments({
      resolverId,
      status: { $ne: "resolved" },
    });

    res.status(200).json({ total, resolved, pending });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
