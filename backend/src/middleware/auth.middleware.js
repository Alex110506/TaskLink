import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Business from '../models/Business.js';

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decode.id).select("-password");
    const user1 = await Business.findById(decode.id).select("-password");

    console.log(decode);

    if (!user && !user1) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user || user1;

    next();
  } catch (error) {
    console.log("Error in protected route middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
