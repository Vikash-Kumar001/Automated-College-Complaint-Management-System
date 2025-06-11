import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  submitComplaint,
  getComplaints,
  fetchComplaintById,
  assignComplaint,
  addCommentToComplaint,
  resolveComplaint,
  deleteComplaint,
  fetchResolverStats
} from "../controllers/complaints/complaint.controller.js";

import getComplaintStats from "../controllers/complaints/getComplaintStats.controller.js";
import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js";
import Feedback from "../models/feedback.model.js";
import SupportRequest from "../models/supportRequest.model.js";
import fetchResolverComplaints from "../controllers/complaints/fetchResolverComplaints.controller.js";
import fetchForwardedComplaints from "../controllers/complaints/fetchForwardedComplaints.controller.js";
import fetchUserComplaintHistory from "../controllers/complaints/fetchUserComplaintHistory.controller.js";
import fetchActiveResolverComplaints from "../controllers/complaints/fetchActiveResolverComplaints.controller.js";
import Notification from "../models/notification.model.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/submit", authMiddleware, upload.single("file"), submitComplaint);
router.get("/", authMiddleware, getComplaints);
router.get("/stats", authMiddleware, getComplaintStats);
router.get("/resolver/stats/:resolverId", authMiddleware, fetchResolverStats);

router.get("/resolver/:resolverId", authMiddleware, fetchResolverComplaints);

router.put("/:id/assign", authMiddleware, assignComplaint);
router.post("/:id/comment", authMiddleware, addCommentToComplaint);
router.put("/:id/resolve", authMiddleware, resolveComplaint);
router.delete("/:id", authMiddleware, deleteComplaint);

router.get("/resolvers", authMiddleware, async (req, res) => {
  try {
    const resolvers = await User.find({ role: "resolver" }, "_id name email");
    res.json(resolvers);
  } catch (error) {
    console.error("Error fetching resolvers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'in progress', 'resolved', 'forwarded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Status updated', complaint: updatedComplaint });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/resolver/stats/:resolverId', authMiddleware, async (req, res) => {
  try {
    const { resolverId } = req.params;
    const total = await Complaint.countDocuments({ resolverId });
    const pending = await Complaint.countDocuments({ resolverId, status: 'pending' });
    const inProgress = await Complaint.countDocuments({ resolverId, status: 'in progress' });
    const resolved = await Complaint.countDocuments({ resolverId, status: 'resolved' });
    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    console.error('Error fetching resolver stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:id/feedback', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const studentId = req.user.userId;
    const complaintId = req.params.id;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }
    const existing = await Feedback.findOne({ complaint: complaintId, student: studentId });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }
    const feedback = new Feedback({ complaint: complaintId, student: studentId, rating, comment });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/support', authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/support', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const supportRequest = new SupportRequest({ name, email, message });
    await supportRequest.save();
    res.status(201).json({ message: 'Support request submitted', supportRequest });
  } catch (error) {
    console.error('Error submitting support request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id/feedback', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find({ complaint: req.params.id }).populate('student', 'name');
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/forwarded", authMiddleware, fetchForwardedComplaints);
router.get("/history", authMiddleware, fetchUserComplaintHistory);
router.get("/:id", authMiddleware, fetchComplaintById);

router.get("/resolver/:resolverId/active", authMiddleware, fetchActiveResolverComplaints);

router.get('/feedbacks', authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('complaint', 'title description _id')
      .populate('student', 'name');
    console.log('[DEBUG] /feedbacks response:', feedbacks);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// TEMP: Test email route
router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: "Test Email from Complaint System",
      text: "This is a test email from the complaint system backend. If you received this, SMTP is working!",
    });
    res.json({ message: "Test email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send test email", error: err.message });
  }
});

export default router;