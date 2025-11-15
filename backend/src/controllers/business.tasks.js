import Task from "../models/Task.js";
import Job from "../models/Job.js";

// Get all tasks for a specific business where the user is assigned
export async function getTasksB(req, res) {
  try {
    const businessId = req.user._id; // pass businessId as query param

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const tasks = await Task.find({ business: businessId })
      .populate("assignedTo", "name email") // populate assigned users
      .populate("business", "name") // populate business name
      .sort({ dueDate: 1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Get business tasks error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Create a new task for a business
export async function createTask(req, res) {
  try {
    const businessId = req.user?._id;

    const { name, importance, description, assignedTo, dueDate, status } = req.body;

    if (!name || !importance || !description || !assignedTo || !dueDate || !businessId) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const newTask = new Task({
      name,
      importance,
      description,
      assignedTo,
      dueDate,
      status: status || "not completed",
      business: businessId, // make sure this matches your schema
    });

    const savedTask = await newTask.save();

    // Populate assignedTo and business
    const populatedTask = await savedTask.populate([
      { path: "assignedTo", select: "_id fullName email" },
      { path: "business", select: "_id name" }
    ]);

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}



// Update an existing task
export async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true })
      .populate("assignedTo", "name email")
      .populate("business", "name");

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getAssignedUsersByBusiness(req, res) {
  try {
    const businessId = req.user._id;

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    // Find all jobs for this business
    const jobs = await Job.find({ company: businessId }).populate("assignedTo", "fullName email");

    // Extract all assigned user IDs
    const allAssignedUsers = jobs.flatMap(job => job.assignedTo);

    // Deduplicate users by _id
    const uniqueUsersMap = new Map();
    allAssignedUsers.forEach(user => {
      if (user && !uniqueUsersMap.has(user._id.toString())) {
        uniqueUsersMap.set(user._id.toString(), user);
      }
    });

    const uniqueUsers = Array.from(uniqueUsersMap.values());

    res.status(200).json({ success: true, users: uniqueUsers });
  } catch (error) {
    console.error("Error fetching assigned users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}