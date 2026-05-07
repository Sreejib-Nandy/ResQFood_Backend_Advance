import express from "express";
import {
  getMonthlyStatsRestaurant,
  getImpactStatsRestaurant,
  getStatusStatsRestaurant,
  getEfficiencyStatsRestaurant
} from "../controllers/statController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/monthly", protect, authorizeRoles("restaurant"), getMonthlyStatsRestaurant);
router.get("/impact", protect, authorizeRoles("restaurant"), getImpactStatsRestaurant);
router.get("/status", protect, authorizeRoles("restaurant"), getStatusStatsRestaurant);
router.get("/efficiency", protect, authorizeRoles("restaurant"), getEfficiencyStatsRestaurant);

export default router;