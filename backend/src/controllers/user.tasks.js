import Task from "../models/Task.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export async function getTasks(req, res) {
  try {
    const userId = req.user._id; // make sure your auth middleware sets req.user

    const tasks = await Task.find({ assignedTo: userId }) // filter tasks where user is assigned
      .sort({ dueDate: 1 }); // optional: sort by due date ascending

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log("Get tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getTeams(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find all jobs where this user is assigned
    const jobs = await Job.find({ assignedTo: userId })
      .populate("assignedTo", "fullName email") // populate users
      .lean();

    // Map each job to a "team" structure
    const teams = jobs.map((job) => ({
      jobId: job._id,
      jobName: job.name,
      users: job.assignedTo, // populated users
    }));

    res.status(200).json({ success: true, teams });
  } catch (err) {
    console.error("getTeams error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


