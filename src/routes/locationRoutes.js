import express from "express";
import { updateLiveLocation } from "../controllers/mapController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/update", protect, updateLiveLocation);

export default router;
