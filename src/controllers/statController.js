import FoodPost from "../models/foodPost.js";
import mongoose from "mongoose";

// Line Chart & Bar Graph
export const getMonthlyStatsRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.user.userId);
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year required",
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const createdStats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          createdPosts: { $sum: 1 }
        }
      }
    ]);

    const collectedStats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          collectedAt: { $gte: start, $lt: end },
          status: "collected"
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$collectedAt" },
          collectedQuantity: { $sum: "$quantity" },
          collectedPosts: { $sum: 1 }
        }
      }
    ]);

    const createdMap = {};
    createdStats.forEach(item => {
      createdMap[item._id] = item.createdPosts;
    });

    const collectedMap = {};
    collectedStats.forEach(item => {
      collectedMap[item._id] = item;
    });

    const daysInMonth = new Date(year, month, 0).getDate();

    const finalData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      finalData.push({
        day,
        createdPosts: createdMap[day] || 0,
        collectedPosts: collectedMap[day]?.collectedPosts || 0,
        collectedQuantity: collectedMap[day]?.collectedQuantity || 0,
      });
    }

    res.json({
      success: true,
      data: finalData
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Impact Cards
export const getImpactStatsRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          status: { $in: ["accepted", "collected"] }
        }
      },
      {
        $group: {
          _id: null,
          totalFood: { $sum: "$quantity" },
          totalPosts: { $sum: 1 }
        }
      }
    ]);

    const totalFood = stats[0]?.totalFood || 0;

    const meals = totalFood;
    const co2Saved = totalFood * 2.5;
    const wasteSaved = totalFood;

    res.json({
      success: true,
      data: {
        totalFood,
        meals,
        co2Saved,
        wasteSaved
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Pie Chart
export const getStatusStatsRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data: stats });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};