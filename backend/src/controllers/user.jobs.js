import Job from "../models/Job.js";
import Business from "../models/Business.js";
import User from "../models/User.js";

const parseSkills = (skillString) => {
  if (!skillString || typeof skillString !== 'string') {
    return [];
  }
  return skillString
    .toLowerCase()
    .split(/[,\s/]+/) // Splits by comma, space, OR slash
    .filter(skill => skill.length > 0); // Removes any empty strings from ",,_/"
};

/**
 * Gets jobs for a user, filtered by skill match and sorted by relevance.
 */
export const getJobs = async (req, res) => {
  try {
    const userId = req.user?._id; // Get user ID from auth middleware

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing from request",
      });
    }

    // 1. Find the user to get their skills
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Parse the user's skills
    const userSkills = parseSkills(user.skills);

    // If the user has no skills, they cannot match any jobs.
    if (userSkills.length === 0) {
        return res.status(200).json({ 
            success: true, 
            count: 0, 
            jobs: [],
            message: "User has no skills to match." 
        });
    }
    
    // 3. Build a regex to find jobs matching AT LEAST ONE skill
    // This allows us to filter efficiently in the database
    // Example: /react|node|python/i
    const skillRegex = new RegExp(userSkills.join('|'), 'i');

    // 4. Find all jobs that:
    //    a) Are NOT assigned to the current user
    //    b) Match at least one of the user's skills (case-insensitive)
    const matchedJobs = await Job.find({
      assignedTo: { $ne: userId },
      skills: { $regex: skillRegex }
    }).populate("company"); // Assumes 'company' ref is 'Business'

    // 5. Score and sort the matched jobs in JavaScript
    const userSkillSet = new Set(userSkills); // Use a Set for fast lookups
    
    const scoredJobs = matchedJobs.map(job => {
        const jobSkills = parseSkills(job.skills);
        const jobSkillSet = new Set(jobSkills); // Use Set to count matches uniquely

        let matchCount = 0;
        
        // Count how many of the job's unique skills are in the user's skill set
        for (const jobSkill of jobSkillSet) {
            if (userSkillSet.has(jobSkill)) {
                matchCount++;
            }
        }
        
        // Return an object with the job and its relevance score
        return { job, matchCount };
    });

    // 6. Sort the jobs by matchCount (most relevant first)
    scoredJobs.sort((a, b) => b.matchCount - a.matchCount);

    // 7. Extract just the job objects from the sorted list
    const sortedJobs = scoredJobs.map(item => item.job);

    // 8. Send the final response
    res.status(200).json({
      success: true,
      count: sortedJobs.length,
      jobs: sortedJobs,
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

export const getBusinesses = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find all jobs where this user is assigned
    const jobs = await Job.find({ assignedTo: userId })
      .populate("company") // populate company details
      .lean();

    // Extract unique companies
    const companyMap = new Map();
    jobs.forEach(job => {
      if (job.company) {
        companyMap.set(job.company._id.toString(), job.company);
      }
    });

    const companies = Array.from(companyMap.values());

    res.status(200).json({ success: true, companies });
  } catch (err) {
    console.error("getBusinesses error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};