import { inngest } from "../client.js";
import ClaimFood from "../../models/claim.js";
import { getIO } from "../../socket/socketHandler.js";

export const expirePendingClaims = inngest.createFunction(
    {
        id: "expire-pending-claims",
        triggers: [{ cron: "*/10 * * * *" }] // every 10 mins
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

        await ClaimFood.updateMany(
            {
                _id: { $in: expiredClaims.map(c => c._id) }
            },
            {
                status: "expired"
            }
        );

        let io;
        try {
            io = getIO();
        } catch (err) {
            console.warn("Socket not initialized - skipping emits at", now);
        }
        if (io) {
            expiredClaims.forEach(claim => {
                io.to(`user:${claim.restaurantId.toString()}`).emit("food_reset");
            });
        }

        console.log("Expired pending claims:", expiredClaims.length);
    }
);