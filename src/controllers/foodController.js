import FoodPost from "../models/foodPost.js";
import ClaimFood from "../models/claim.js";
import { getIO } from "../socket/socketHandler.js";
import axios from "axios";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { foodClaimedOwnerTemplate, foodClaimedNgoTemplate, foodCollectedNgoTemplate, foodCollectedOwnerTemplate } from "../utils/emailTemplates.js";

// Create a new food post
export const createFood = async (req, res) => {
  try {
    const { food_name, quantity, unit, description, expiry_time } = req.body;
    const user = await User.findById(req.user.userId);

    // Basic validation
    if (!food_name || !quantity || !unit || !expiry_time) {
      return res.status(400).json({
        success: false,
        message: "Fields are missing",
      });
    }

    // File check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    // Location check
    if (!user.location) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    const image = [
      {
        url: req.file.path,
        public_id: req.file.filename,
      },
    ];

    const post = await FoodPost.create({
      restaurantId: req.user.userId,
      food_name,
      quantity,
      unit,
      description,
      expiry_time: new Date(expiry_time),
      location: user.location,
      food_image: image,
    });

    // Socket emit (SAFE + ROOM BASED)
    let io;
    try {
      io = getIO();
    } catch {
      console.warn("Socket not initialized");
    }

    if (io) {
      // send only to NGOs (not everyone)
      io.to("role:ngo").emit("new_food_post", post);
    }

    return res.status(201).json({
      success: true,
      message: "Food created",
      post,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all foodposts from specific restaurant
export const getFoodPostsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foodPosts = await FoodPost.find({ restaurantId })
      .populate("restaurantId", "name address contactInfo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodPosts.length,
      data: foodPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food posts",
    });
  }
};


// Get all the food post from different restaurants
export const getAllFood = async (req, res) => {
  try {
    const posts = await FoodPost.find({ status: "available" }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get food within radius (km) from given coords. If no coords passed, uses user's saved location
export const getNearbyFoods = async (req, res) => {
  try {
    let { radius_km } = req.query;
    const user = await User.findById(req.user.userId);
    radius_km = Math.min(parseFloat(radius_km || "5"), 50);

    // use user's saved location if not provided
    if (!user || !user.location?.coordinates) {
      return res.status(400).json({
        success: false,
        message: "Provide coordinates or set user profile location",
      });
    }
    const [lng, lat] = user.location.coordinates;

    const meters = radius_km * 1000;

    const foods = await FoodPost.find({
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: meters
        }
      }
    }).sort({ createdAt: -1 });

    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getClaimedFoodsByNGO = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    const foods = await FoodPost.find({
      claimedBy: ngoId,
      status: { $in: ["claimed", "accepted", "collected"] },
    })
      .populate("restaurantId", "name address")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const claimFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const ngoId = req.user.userId;

    const food = await FoodPost.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (food.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Food is not available",
      });
    }

    // prevent duplicate claim (your unique index helps)
    const existing = await ClaimFood.findOne({ foodPostId: foodId, ngoId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already claimed this food",
      });
    }

    const claim = await ClaimFood.create({
      foodPostId: foodId,
      ngoId,
      restaurantId: food.restaurantId,
    });

    let io;
    try { io = getIO(); } catch { }

    if (io) {
      // notify restaurant (new claim request)
      io.to(`user:${food.restaurantId}`).emit("new_claim", {
        claimId: claim._id,
        foodId: food._id,
        ngoId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Claim request sent",
      claim,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const acceptClaim = async (req, res) => {
  try {
    const { claimId } = req.body;

    const claim = await ClaimFood.findById(claimId);
    if (!claim || claim.status !== "pending") {
      return res.status(400).json({ success: false, message: "Invalid claim" });
    }

    // accept selected claim
    claim.status = "accepted";
    claim.acceptedAt = new Date();
    await claim.save();

    // reject all other claims
    await ClaimFood.updateMany(
      {
        foodPostId: claim.foodPostId,
        _id: { $ne: claimId }
      },
      {
        status: "rejected",
        rejectedAt: new Date()
      }
    );

    // update food
    const food = await FoodPost.findById(claim.foodPostId);
    if (food) {
      food.status = "accepted";
      food.claimedBy = claim.ngoId;
      await food.save();
    }

    let io;
    try { io = getIO(); } catch { }

    if (io) {
      // notify accepted NGO
      io.to(`user:${claim.ngoId}`).emit("claim_accepted", {
        foodId: claim.foodPostId,
      });

      // notify others (optional but useful)
      io.to("role:ngo").emit("food_unavailable", {
        foodId: claim.foodPostId,
      });

      io.to(`user:${claim.restaurantId}`).emit("stats_updated");
    }

    res.status(200).json({
      success: true,
      message: "Claim accepted",
      destination: {
        lat: food.location.coordinates[1],
        lng: food.location.coordinates[0],
        restaurantId: food.restaurantId
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const rejectClaim = async (req, res) => {
  try {
    const { claimId } = req.body;

    const claim = await ClaimFood.findById(claimId);
    if (!claim || claim.status !== "pending") {
      return res.status(400).json({ success: false, message: "Invalid claim" });
    }

    claim.status = "rejected";
    claim.rejectedAt = new Date();
    await claim.save();

    let io;
    try { io = getIO(); } catch { }

    if (io) {
      io.to(`user:${claim.ngoId}`).emit("claim_rejected", {
        foodId: claim.foodPostId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Claim rejected",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const markCollected = async (req, res) => {
  try {
    const { claimId } = req.body;

    const claim = await ClaimFood.findById(claimId);
    if (!claim || claim.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Invalid claim" });
    }

    claim.status = "collected";
    await claim.save();

    await FoodPost.findByIdAndUpdate(claim.foodPostId, {
      status: "collected",
      collectedAt: new Date(),
    });

    let io;
    try { io = getIO(); } catch { }

    if (io) {
      io.to(`user:${claim.restaurantId}`).emit("food_collected", {
        foodId: claim.foodPostId,
      });

      io.to(`user:${claim.restaurantId}`).emit("stats_updated");
    }

    res.json({ success: true, message: "Collected" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getRestaurantClaims = async (req, res) => {
  try {
    const restaurantId = req.user.userId;

    const claims = await ClaimFood.find({
      restaurantId,
      status: "pending",
    })
      .populate("foodPostId", "food_name quantity unit expiry_time")
      .populate("ngoId", "name email contactInfo")
      .sort({ createdAt: -1 });

    // socket emit (optional but useful)
    let io;
    try { io = getIO(); } catch { }

    if (io) {
      io.to(`user:${restaurantId}`).emit("restaurant_claims_update", {
        count: claims.length,
      });
    }

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};