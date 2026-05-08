import { inngest } from "../client.js";
import ClaimFood from "../../models/claim.js";
import FoodPost from "../../models/foodPost.js";
import { getIO } from "../../socket/socketHandler.js";

export const expirePendingClaims = inngest.createFunction(
  {
    id: "expire-pending-claims",
    triggers: [{ cron: "*/10 * * * *" }]
  },
  async () => {
    const now = new Date();

    const expiredClaims = await ClaimFood.find({
      status: "pending",
      expiresAt: { $lte: now }
    });

    if (!expiredClaims.length) {
      console.log("No pending claims expired");
      return;
    }

    const claimIds = expiredClaims.map(c => c._id);

    // Expire claims
    await ClaimFood.updateMany(
      { _id: { $in: claimIds } },
      { status: "expired" }
    );

    let io;
    try {
      io = getIO();
    } catch (err) {
      console.warn("Socket not initialized - skipping emits");
    }

    // Process each claim
    for (let claim of expiredClaims) {
      const foodId = claim.foodPostId;

      // Check if any active claim still exists
      const activeClaimExists = await ClaimFood.exists({
        foodPostId: foodId,
        status: { $in: ["pending", "accepted"] }
      });

      // Reset food ONLY if no active claims
      if (!activeClaimExists) {
        await FoodPost.findByIdAndUpdate(foodId, {
          status: "available",
          claimedBy: null
        });

        if (io) {
          // NGOs → food visible again
          io.to("role:ngo").emit("food_available_again", {
            foodId: foodId.toString()
          });
        }
      }

      if (io) {
        // Restaurant → claim expired
        io.to(`user:${claim.restaurantId}`).emit("claim_expired", {
          foodId: foodId.toString()
        });
      }
    }

    console.log("Expired pending claims:", expiredClaims.length);
  }
);