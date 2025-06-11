import mongoose from "mongoose";
import Complaint from "../models/complaint.model.js";
import dotenv from "dotenv";
dotenv.config();

const allowedStatuses = ["pending", "in progress", "resolved", "forwarded"];

async function normalizeComplaints() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const complaints = await Complaint.find();
  let updated = 0;
  let skipped = 0;
  for (const complaint of complaints) {
    let changed = false;
    // Normalize status
    let status = (complaint.status || "pending").toLowerCase().trim();
    if (!allowedStatuses.includes(status)) {
      // Try to fix common typos
      if (["inprogress", "in_progress", "progress"].includes(status)) status = "in progress";
      else if (["resolve", "resloved", "solved"].includes(status)) status = "resolved";
      else if (["forward", "forwared", "fwd"].includes(status)) status = "forwarded";
      else if (["pendng", "pend", "waiting"].includes(status)) status = "pending";
    }
    if (!allowedStatuses.includes(status)) {
      skipped++;
      console.log(`Skipped complaint ${complaint._id}: unknown status '${complaint.status}'`);
      continue;
    }
    if (complaint.status !== status) {
      complaint.status = status;
      changed = true;
    }
    // Ensure resolverId and studentId are ObjectIds
    if (complaint.resolverId && typeof complaint.resolverId === "string") {
      complaint.resolverId = new mongoose.Types.ObjectId(complaint.resolverId);
      changed = true;
    }
    if (complaint.studentId && typeof complaint.studentId === "string") {
      complaint.studentId = new mongoose.Types.ObjectId(complaint.studentId);
      changed = true;
    }
    if (changed) {
      await complaint.save();
      updated++;
      console.log(`Updated complaint ${complaint._id}`);
    }
  }
  console.log(`Normalization complete. Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

normalizeComplaints().catch(err => {
  console.error("Error normalizing complaints:", err);
  process.exit(1);
}); 