import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function signupU(req, res) {
  const {
    email,
    password,
    fullName,
    phoneNumber,
    bio,
    job,
    yearsExperience,
    skills,
    location
  } = req.body;

  try {
    // 1. Required fields check
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Password length check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // 3. Email validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists. Please use a different one" });
    }

    // 5. Generate random avatar
    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

    // 6. Create new user with all fields included
    const newUser = await User.create({
      email,
      fullName,
      password,
      phoneNumber,
      bio,
      job,
      yearsExperience,
      skills,
      location,
      profilePic: randomAvatar
    });

    // 7. Create Stream user (fails gracefully)
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || ""
      });
      console.log("Stream user created with id: " + newUser._id);
    } catch (error) {
      console.log("Error creating Stream user");
    }

    // 8. Sign JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d"
      }
    );

    // 9. Send secure cookie
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax", // allows cross-origin on localhost
      secure: false,    // false for dev (HTTP)
    });

    // 10. Response
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Signup error ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function loginU(req,res){
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const isPasswordCorrect=await user.matchPassword(password)
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"30d"
        })

        console.log(token,"login");

        res.cookie("jwt", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax", // allows cross-origin on localhost
          secure: false,    // false for dev (HTTP)
        });

        res.status(200).json({success:true,user,token})
    } catch (error) {
        console.log("Signup error ",error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function logoutU(req,res){
    res.clearCookie("jwt")
    res.status(200).json({success:true,message:"Logout successful"})
}


export async function updateUserU(req, res) {
  const userId = req.user?._id;
  const {
    fullName,
    phoneNumber,
    bio,
    job,
    yearsExperience,
    skills,
    location
  } = req.body;

  try {
    console.log(userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(bio && { bio }),
        ...(job && { job }),
        ...(yearsExperience !== undefined && { yearsExperience }),
        ...(skills && { skills }),
        ...(location && { location })
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("Update user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getUserProfileU(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password"); // hide password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("Get profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


