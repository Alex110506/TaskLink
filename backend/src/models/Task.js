import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    importance: {
      type: String,
      enum: ["low", "medium", "high"], // 3-element enum
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",       // relation to Team schema
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["not completed", "pending", "completed"],
      default: "not completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
