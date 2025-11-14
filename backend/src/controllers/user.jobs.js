import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  try {
    // Fetch all jobs, including the related Business (company)
    const jobs = await Job.find().populate("company");

    
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
