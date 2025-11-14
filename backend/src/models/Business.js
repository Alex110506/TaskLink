import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    field: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // you can change this
    },

    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

businessSchema.pre("save",async function (next) {
    if(!this.isModified("password"))
        return next();
    try {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt)
        next()
    } catch (error) {
        next(error)
    }
})

businessSchema.methods.matchPassword=async function (enteredPassword) {
    const isCorrect=await bcrypt.compare(enteredPassword,this.password)
    return isCorrect;
}


export default mongoose.model("Business", businessSchema);
