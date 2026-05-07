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

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const start = new Date(yearNum, monthNum - 1, 1);
    const end = new Date(yearNum, monthNum, 1);

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
        },
      }, { $sort: { _id: 1 } }
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
        },
      }, { $sort: { _id: 1 } }
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

    // ALL POSTS (posted food)
    const totalPosted = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
        }
      },
      {
        $group: {
          _id: null,
          totalFoodPosted: { $sum: "$quantity" },
          totalPosts: { $sum: 1 }
        }
      }
    ]);

    // ONLY COLLECTED
    const totalCollected = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          status: "collected"
        }
      },
      {
        $group: {
          _id: null,
          totalFoodCollected: { $sum: "$quantity" }
        }
      }
    ]);

    const mealsPosted = totalPosted[0]?.totalFoodPosted || 0;
    const mealsCollected = totalCollected[0]?.totalFoodCollected || 0;

    // Impact calculations
    const wasteSaved = Math.round(mealsCollected * 0.74 * 100) / 100;
    const co2Saved = Math.round(mealsCollected * 2.4 * 100) / 100;

    res.json({
      success: true,
      data: {
        mealsPosted,
        mealsCollected,
        wasteSaved,
        co2Saved
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Pie Chart
export const getStatusStatsRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.user.userId);
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const stats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = stats.map(s => ({
      name: s._id,
      value: s.count
    }));

    res.json({ success: true, data: formatted });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEfficiencyStatsRestaurant = async (req, res) => {
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

    // Created Posts per day
    const createdStats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          createdPosts: { $sum: 1 },
        },
      },
    ]);

    // Collected Posts per day
    const collectedStats = await FoodPost.aggregate([
      {
        $match: {
          restaurantId: restaurantObjectId,
          status: "collected",
          collectedAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$collectedAt" },
          collectedPosts: { $sum: 1 },
        },
      },
    ]);

    // Convert to map
    const createdMap = {};
    createdStats.forEach((i) => (createdMap[i._id] = i.createdPosts));

    const collectedMap = {};
    collectedStats.forEach((i) => (collectedMap[i._id] = i.collectedPosts));

    const daysInMonth = new Date(year, month, 0).getDate();

    const finalData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const created = createdMap[day] || 0;
      const collected = collectedMap[day] || 0;

      const efficiency =
        created > 0
          ? Math.round((collected / created) * 100)
          : 0;

      finalData.push({
        day,
        efficiency,
      });
    }

    res.json({
      success: true,
      data: finalData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};