import express from "express";
import {
  createOrderController,
  razorpayWebhook,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/order", protect, createOrderController);

export default router;