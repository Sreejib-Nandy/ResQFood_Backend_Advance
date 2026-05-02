import { inngest } from "../client.js";
import FoodPost from "../../models/foodPost.js";

export const cleanupExpiredFoods = inngest.createFunction(
  {
    id: "cleanup-expired-foods",
    triggers: [{ cron: "0 3 * * *" }]
  }, // every day at 3 AM
  async () => {
    const res = await FoodPost.deleteMany({
      status: "expired",
      expiredAt: {
        $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    if (res.deletedCount > 0) {
      console.log("Cleaned expired foods:", res.deletedCount);
    }
  }
);
