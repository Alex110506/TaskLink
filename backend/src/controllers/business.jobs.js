import Job from "../models/Job.js";
import Business from "../models/Business.js";
import User from "../models/User.js";

// Get all jobs for a specific business
export async function getJobsB(req, res) {
  try {
    const businessId = req.user._id; // pass businessId as query param

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const jobs = await Job.find({ company: businessId })
      .populate("company", "name")
      .populate("assignedTo", "fullName email skills yearsExperience location")
      .populate("jobApplicants", "fullName email skills yearsExperience location");

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get business jobs error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Create a new job for a business
export async function createJob(req, res) {
  try {
    const {
      name,
      description,
      skills,
      location,
      employmentType,
      numberOfPositions,
      assignedTo,
      jobApplicants,
    } = req.body;

    const company = req.user._id;

    if (!name || !description || !skills || !company || !location || !employmentType) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const newJob = new Job({
      name,
      description,
      skills,
      company,
      location,
      employmentType,
      numberOfPositions: numberOfPositions || 1,
      assignedTo: assignedTo || [],
      jobApplicants: jobApplicants || [],
    });

    const savedJob = await newJob.save();

    const populatedJob = await Job.findById(savedJob._id)
      .populate("company", "name")
      .populate("assignedTo", "fullName email skills yearsExperience location")
      .populate("jobApplicants", "fullName email skills yearsExperience location");

    res.status(201).json({ success: true, job: populatedJob });

  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


// Accept a candidate for a job
export async function acceptCandidate(req, res) {
  console.log("accept");
  try {
    const jobId = req.params.id;
    const { userId } = req.body;
    console.log("Job ID:", jobId, "User ID:", userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Remove from applicants if exists
    job.jobApplicants = job.jobApplicants.filter(id => id.toString() !== userId);
    // Add to assignedTo if not already there
    if (!job.assignedTo.includes(userId)) {
      job.assignedTo.push(userId);
    }

    await job.save();

    const populatedJob = await job.populate([
      { path: "company", select: "name" },
      { path: "assignedTo", select: "fullName email" },
      { path: "jobApplicants", select: "fullName email" },
    ]);

    res.status(200).json({ success: true, job: populatedJob });
  } catch (error) {
    console.error("Accept candidate error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


// Reject a candidate for a job
export async function rejectCandidate(req, res) {
  try {
    const jobId = req.params.id;
    const { userId } = req.body; // ID of the candidate to reject

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Remove the candidate from jobApplicants
    job.jobApplicants = job.jobApplicants.filter(id => id.toString() !== userId);

    await job.save();
    const populatedJob = await job
      .populate("company", "name")
      .populate("assignedTo", "name email")
      .populate("jobApplicants", "name email");

    res.status(200).json({ success: true, job: populatedJob });
  } catch (error) {
    console.error("Reject candidate error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getUsers(req, res) {
  try {
    const businessId = req.user?._id;
    if (!businessId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1. Find all jobs for this business
    const jobs = await Job.find({ company: businessId })
      .populate("assignedTo", "fullName email") // populate only needed fields
      .lean();

    // 2. Collect all assigned users across jobs
    const allUsers = jobs.flatMap(job => job.assignedTo || []);

    // 3. Remove duplicate users based on _id
    const uniqueUsersMap = new Map();
    allUsers.forEach(user => {
      uniqueUsersMap.set(user._id.toString(), user);
    });

    const uniqueUsers = Array.from(uniqueUsersMap.values());

    res.status(200).json({ success: true, users: uniqueUsers });
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
