import cookie from "cookie";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuth = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("No cookies found"));
    }

    const parsed = cookie.parse(cookies);
    const token = parsed.token;

    if (!token) {
      return next(new Error("No token found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("_id role isDeleted");

    if (!user) {
      return next(new Error("User not found"));
    }

    if (user.isDeleted) {
      return next(new Error("User deactivated"));
    }

    socket.user = {
      userId: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    next(new Error(err.message));
  }
};