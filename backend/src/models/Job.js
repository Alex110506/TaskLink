import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: String, // can be converted to array later if needed
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",   // relation to Business schema
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    employmentType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      required: true,
    },

    numberOfPositions: {
      type: Number,
      default: 1,
      min: 1,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
