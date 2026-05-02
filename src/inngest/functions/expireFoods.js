import { inngest } from "../client.js";
import FoodPost from "../../models/foodPost.js";
import { getIO } from "../../socket/socketHandler.js";

export const expireFoods = inngest.createFunction(
  {
    id: "expire-foods",
    triggers: [{ cron: "*/2 * * * *" }]
  },
  async () => {
    const now = new Date();

    const expiredPosts = await FoodPost.find({
      expiry_time: { $lte: now },
      status: { $in: ["available", "claimed"] },
      expiredAt: { $exists: false }
    }).select("_id restaurantId claimedBy").lean();

    if (!expiredPosts.length) {
      console.log("No foods expired at ", now);
      return;
    };

    await FoodPost.updateMany(
      { _id: { $in: expiredPosts.map(p => p._id) } },
      {
        status: "expired",
        expiredAt: now,
      }
    );

    let io;
    try {
      io = getIO();
    } catch (err) {
      console.warn("Socket not initialized - skipping emits at", now);
    }

    if (io) {
      expiredPosts.forEach(post => {
        // notify restaurant
        io.to(`user:${post.restaurantId.toString()}`).emit("food_expired", {
          id: post._id.toString(),
        });

        // notify NGO if claimed
        if (post.claimedBy) {
          io.to(`user:${post.claimedBy.toString()}`).emit("food_expired", {
            id: post._id.toString(),
          });
        }
      });
    }

    console.log("Expired foods:", expiredPosts.length);
  }
);