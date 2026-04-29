import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // use correct field
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // block deactivated users
    if (user.isDeleted) {
      return res.status(403).json({
        message: "Account is deactivated"
      });
    }

    // consistent structure
    req.user = {
      userId: user._id,
      role: user.role,
      status: user.status,
      trialEndDate: user.trialEndDate,
      subscriptionEndDate: user.subscriptionEndDate
    };

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again"
      });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};


// role-based guard
export const authorizeRoles = (...roles) => async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}