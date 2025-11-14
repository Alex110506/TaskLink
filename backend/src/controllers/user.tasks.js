import Task from "../models/Task.js";

export async function getTasks(req, res) {
  try {
    const userId = req.user._id; // make sure your auth middleware sets req.user

    const tasks = await Task.find({ assignedTo: userId }) // filter tasks where user is assigned
      .populate("team", "name members") // populate team name and members
      .sort({ dueDate: 1 }); // optional: sort by due date ascending

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.log("Get tasks error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
