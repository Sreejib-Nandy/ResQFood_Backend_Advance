import User from "../models/User.js";
import FoodPost from "../models/foodPost.js";
import cloudinary from "../config/cloudinary.js";

// Update profile and optionally single avatar upload (req.file)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address, contactInfo, latitude, longitude } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isProfileComplete) {
      return res.status(400).json({ message: "Complete profile first" });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        message: "Account deactivated",
      });
    }

    // contact validation
    if (contactInfo) {
      if (!/^\d{10}$/.test(contactInfo)) {
        return res.status(400).json({
          message: "Invalid contact number",
        });
      }
      user.contactInfo = contactInfo;
    }

    if (address) user.address = address;

    // location update
    let locationUpdated = false;

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      user.location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };
      locationUpdated = true;
    }

    await user.save();

    // sync food posts location
    if (locationUpdated) {
      await FoodPost.updateMany(
        { restaurantId: userId },
        { $set: { location: user.location } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "restaurant") {
      const foodPosts = await FoodPost.find({ restaurantId: userId });

      for (const post of foodPosts) {
        for (const img of post.food_image || []) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      await FoodPost.deleteMany({ restaurantId: userId });
    }

    if (user.role === "ngo") {
      await FoodPost.updateMany(
        { claimedBy: userId, status: "claimed" },
        {
          status: "available",
          claimedBy: null,
          claimedAt: null
        }
      );
    }

    if (user?.isDeleted) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DEACTIVATED",
        message: "Account is deactivated.",
      });
    }

    // deactivate instead of delete
    user.isDeleted = true;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Account deactivated",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};