import express from "express";
import {
    createFood,
    updateFood, 
    deleteFood,
    getAllFood,
    getNearbyFoods,
    getFoodPostsByRestaurant,
    claimFood,
    acceptClaim,
    rejectClaim,
    markCollected,
    getClaimedFoodsByNGO,
    getRestaurantClaims
} from "../controllers/foodController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import {verifyRestaurantOwnership } from "../middlewares/foodMiddleware.js"; 
import { checkAccess } from "../middlewares/subscriptionMiddleware.js";
import parser from "../middlewares/upload.js";

const router = express.Router();

// Create food
router.post(
    "/create",
    protect,
    authorizeRoles("restaurant"),
    checkAccess,
    parser.single("food_image"),
    createFood
);

// Update food post
router.put(
  "/:id",
  protect,
  verifyRestaurantOwnership,
  parser.single("food_image"),
  updateFood
);

// Delete food post
router.delete(
  "/:id",
  protect,
  verifyRestaurantOwnership,
  deleteFood
);

// Get all available food
router.get("/", protect, getAllFood);

// Nearby food
router.get("/nearby", protect, getNearbyFoods);

// Restaurant specific posts
router.get("/restaurant/:restaurantId", protect, getFoodPostsByRestaurant);

// NGO claimed foods
router.get("/ngo/claimed", protect, authorizeRoles("ngo"), getClaimedFoodsByNGO);

// Claim food
router.post("/claim/:id", protect, authorizeRoles("ngo"), claimFood);

// Accept / Reject / Collect
router.post("/accept", protect, authorizeRoles("restaurant"), acceptClaim);
router.post("/reject", protect, authorizeRoles("restaurant"), rejectClaim);
router.post("/collect", protect, authorizeRoles("ngo"), markCollected);

// Restaurant claims dashboard
router.get("/claims", protect, authorizeRoles("restaurant"), getRestaurantClaims);

export default router;