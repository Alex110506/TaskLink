import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  try {
    const userId = req.user?._id; // depends on your auth middleware

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing from request",
      });
    }

    // get only jobs where assignedTo does NOT contain the user
    const jobs = await Job.find({
      assignedTo: { $ne: userId }
    }).populate("company");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
    });
  }
};

export const sendApplication = async (req, res) => {
  try {
    const userId = req.user._id;       // from auth middleware
    const { jobId } = req.params;      // URL param

    // 1. Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 2. Prevent assigned users from applying
    if (job.assignedTo.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already assigned to this job.",
      });
    }

    // 3. Prevent duplicate application
    if (job.jobApplicants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // 4. Add user to jobApplicants
    job.jobApplicants.push(userId);
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Application sent successfully.",
      job,
    });

  } catch (error) {
    console.error("Error sending job application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending job application",
    });
  }
};
