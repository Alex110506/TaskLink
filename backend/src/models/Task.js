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
      enum: ["low", "medium", "high"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["not completed", "pending", "completed"],
      default: "not completed",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true, // set to true if every task must belong to a business
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
