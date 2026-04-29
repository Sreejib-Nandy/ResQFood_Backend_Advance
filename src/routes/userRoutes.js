import express from "express";
import {
  updateProfile,
  deleteProfile
} from "../controllers/userController.js";
import User from "../models/User.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteProfile);

// get current user 
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;