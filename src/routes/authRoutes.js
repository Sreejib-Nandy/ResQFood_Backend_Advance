import express from "express";
import {
  googleAuth,
  signUp,
  login,
  logout,
  completeProfile
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/google", googleAuth);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.put("/complete-profile", protect, completeProfile);

export default router;