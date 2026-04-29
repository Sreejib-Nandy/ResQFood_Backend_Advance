import { inngest } from "../client.js";
import ClaimFood from "../../models/claim.js";
import FoodPost from "../../models/foodPost.js";
import { getIO } from "../../socket/socketHandler.js";

export const expireUncollectedFood = inngest.createFunction(
    {
        id: "expire-uncollected-food",
        triggers: [{ cron: "*/10 * * * *" }]
    },
    async () => {
        const now = new Date();

        // find accepted claims older than 60 mins
        const staleClaims = await ClaimFood.find({
            status: "accepted",
            acceptedAt: { $lte: new Date(now - 60 * 60 * 1000) }
        });

        if (!staleClaims.length) {
            console.log("No uncollected food expired");
            return;
        }

        // expire claims
        await ClaimFood.updateMany(
            { _id: { $in: staleClaims.map(c => c._id) } },
            { status: "expired" }
        );

        // reset food
        await FoodPost.updateMany(
            { _id: { $in: staleClaims.map(c => c.foodPostId) } },
            {
                status: "available",
                claimedBy: null
            }
        );

        let io;
        try {
            io = getIO();
        } catch (err) {
            console.warn("Socket not initialized - skipping emits at", now);
        }

        if (io) {
            staleClaims.forEach(claim => {
                io.to(`user:${claim.restaurantId.toString()}`).emit("food_reset");
            });
        }

        console.log("Uncollected food reset:", staleClaims.length);
    }
);