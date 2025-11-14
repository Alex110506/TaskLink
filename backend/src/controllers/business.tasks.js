import Task from "../models/Task.js";

// Get all tasks for a specific business where the user is assigned
export async function getTasksB(req, res) {
  try {
    const userId = req.user._id; // assuming auth middleware sets req.user
    const businessId = req.query.businessId; // pass businessId as query param

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const tasks = await Task.find({ business: businessId, assignedTo: userId })
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
    const { name, importance, description, assignedTo, dueDate, status, business } = req.body;

    if (!name || !importance || !description || !assignedTo || !dueDate || !business) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const newTask = new Task({
      name,
      importance,
      description,
      assignedTo,
      dueDate,
      status: status || "not completed",
      business,
    });

    const savedTask = await newTask.save();
    const populatedTask = await savedTask.populate("assignedTo", "name email").populate("business", "name");

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
