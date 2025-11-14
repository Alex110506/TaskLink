import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    users: {
      type: [String],   // a list of predefined strings
      required: true,
      default: [],      // starts empty unless filled manually
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",       // relation to Job schema
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
