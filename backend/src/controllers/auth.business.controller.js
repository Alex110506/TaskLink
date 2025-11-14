import Business from "../models/Business.js";
import jwt from "jsonwebtoken";


export async function signupB(req, res) {
  const {
    name,
    field,
    about,
    email,
    phone,
    password,
    location,
  } = req.body;

  try {
    // 1. Required fields
    if (!name || !field || !about || !email || !phone || !password || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 4. Check if business already exists
    const existing = await Business.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already exists. Use a different one." });
    }

    // 5. Create business
    const newBusiness = await Business.create({
      name,
      field,
      about,
      email,
      phone,
      password, // hashed by schema
      location,
    });

    // 6. Generate JWT
    const token = jwt.sign(
      { id: newBusiness._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    // 7. Set cookie
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, business: newBusiness });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function loginB(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const business = await Business.findOne({ email });

    if (!business)
      return res.status(401).json({ message: "Invalid email or password" });

    const isCorrect = await business.matchPassword(password);

    if (!isCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: business._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function logoutB(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}


export async function updateBusinessB(req, res) {
  const businessId = req.params.id;
  const {
    name,
    field,
    about,
    email,
    phone,
    location,
  } = req.body;

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      {
        ...(name && { name }),
        ...(field && { field }),
        ...(about && { about }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(location && { location }),
      },
      { new: true }
    );

    if (!updatedBusiness)
      return res.status(404).json({ message: "Business not found" });

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.log("Update business error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getBusinessProfileB(req, res) {
  const businessId = req.params.id;

  try {
    const business = await Business.findById(businessId).select("-password");

    if (!business)
      return res.status(404).json({ message: "Business not found" });

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.log("Get business profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
