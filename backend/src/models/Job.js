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
      type: String, // You can convert this to an array later if needed
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",   // <-- relation to Business schema
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
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
