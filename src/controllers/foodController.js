import FoodPost from "../models/foodPost.js";
import ClaimFood from "../models/claim.js";
import { getIO } from "../socket/socketHandler.js";
import axios from "axios";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
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
      message: "Food created successfully",
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

// Update the food post
export const updateFood = async (req, res) => {
  try {
    const updates = req.body;

    const allowedUpdates = [
      "food_name",
      "quantity",
      "unit",
      "description",
      "expiry_time"
    ];

    const food = await FoodPost.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        food[field] =
          field === "quantity"
            ? Number(updates[field])
            : updates[field];
      }
    });

    if (updates.expiry_time) {
      food.expiry_time = new Date(updates.expiry_time);
    }

    if (req.file) {
      if (food.food_image?.[0]?.public_id) {
        await cloudinary.uploader.destroy(
          food.food_image[0].public_id
        );
      }

      food.food_image = [
        {
          url: req.file.path,
          public_id: req.file.filename,
        },
      ];
    }

    await food.save();

    // Socket emit (same pattern as create)
    let io;
    try {
      io = getIO();
    } catch {
      console.warn("Socket not initialized");
    }

    if (io) {
      io.to("role:ngo").emit("food_updated", food);
    }

    return res.json({
      success: true,
      message: "Food post updated successfully",
      food: req.food,
    });

  } catch (error) {
    console.error("Update food error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete the food post
export const deleteFood = async (req, res) => {
  try {
    const food = await FoodPost.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const foodId = food._id;

    await food.deleteOne();

    await ClaimFood.deleteMany({ foodPostId: foodId });

    // Socket emit (same pattern)
    let io;
    try {
      io = getIO();
    } catch {
      console.warn("Socket not initialized");
    }

    if (io) {
      io.to("role:ngo").emit("food_deleted", {
        foodId: foodId.toString(),
      });
    }

    return res.json({
      success: true,
      message: "Food post deleted successfully",
    });

  } catch (error) {
    console.error("Delete food error:", error);
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
    radius_km = parseFloat(radius_km);

    if (!radius_km || isNaN(radius_km)) {
      radius_km = 5;
    }

    radius_km = Math.max(1, Math.min(radius_km, 50));

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
    }).populate("restaurantId", "name address contactInfo").sort({ createdAt: -1 });

    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClaimedFoodsByNGO = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    const claims = await ClaimFood.find({
      ngoId,
      status: { $in: ["accepted", "collected"] },
    })
      .populate({
        path: "foodPostId",
        select: "food_name quantity unit description expiry_time food_image location",
      })
      .populate({
        path: "restaurantId",
        select: "name address location",
      })
      .sort({ updatedAt: -1 });

    // remove broken references
    const validClaims = claims.filter(c => c.foodPostId !== null);

    res.status(200).json({
      success: true,
      count: validClaims.length,
      data: validClaims,
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
    if (!food || food.status !== "available") {
      return res.status(400).json({ success: false, message: "Food not available" });
    }

    // prevent duplicate claim
    const existing = await ClaimFood.findOne({ foodPostId: foodId, ngoId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already claimed" });
    }

    const claim = await ClaimFood.create({
      foodPostId: foodId,
      ngoId,
      restaurantId: food.restaurantId,
    });

    const io = getIO();

    // notify restaurant
    io.to(`user:${food.restaurantId}`).emit("new_claim", {
      claimId: claim._id,
      foodId: food._id,
      ngoId,
    });

    res.json({ success: true, claim });

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
      io.to(`user:${claim.ngoId}`).emit("claim_accepted", {
        foodId: claim.foodPostId,
        restaurantLocation: {
          lat: food.location.coordinates[1],
          lng: food.location.coordinates[0],
        },
        restaurantId: claim.restaurantId,
      });

      // other NGOs ONLY
      const sockets = await io.in("role:ngo").fetchSockets();

      sockets.forEach((s) => {
        if (s.user.userId !== claim.ngoId) {
          s.emit("food_unavailable", { foodId: claim.foodPostId });
        }
      });
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

      io.to(`user:${claim.ngoId}`).emit("food_collected", {
        foodId: claim.foodPostId,
      });
    }

    res.json({ success: true, message: "Food collected successfully" });

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
      .populate("foodPostId", "food_name quantity unit description expiry_time food_image")
      .populate("ngoId", "name address contactInfo")
      .sort({ createdAt: -1 });

    // REMOVE INVALID CLAIMS (food deleted)
    const validClaims = claims.filter(c => c.foodPostId !== null);

    // SOCKET (use correct count)
    let io;
    try { io = getIO(); } catch { }

    if (io) {
      io.to(`user:${restaurantId}`).emit("restaurant_claims_update", {
        count: validClaims.length,
      });
    }

    // RETURN VALID CLAIMS ONLY
    res.status(200).json({
      success: true,
      count: validClaims.length,
      data: validClaims,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    const claims = await ClaimFood.find({
      ngoId,
      status: { $in: ["pending", "accepted", "rejected"] },
    }).select("foodPostId");

    const claimedFoodIds = claims.map(c => c.foodPostId.toString());

    res.json({
      success: true,
      claimedFoodIds,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const { claimId } = req.params;
    const userId = req.user.userId; // from auth middleware

    const claim = await ClaimFood.findById(claimId)
      .populate({
        path: "foodPostId",
        select: "food_name quantity unit location",
      })
      .populate({
        path: "restaurantId",
        select: "name location address",
      });

    // not found
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    // SECURITY (VERY IMPORTANT)
    if (claim.ngoId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // broken reference safety
    if (!claim.restaurantId || !claim.foodPostId) {
      return res.status(400).json({
        success: false,
        message: "Invalid claim data",
      });
    }


    res.status(200).json({
      success: true,
      data: claim,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};