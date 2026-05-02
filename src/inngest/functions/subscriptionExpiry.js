import { inngest } from "../client.js";
import User from "../../models/User.js";

export const expireSubscriptions = inngest.createFunction(
  {
    id: "expire-subscriptions",
    triggers: [{ cron: "0 2 * * *" }] // daily
  },
  async ({ step }) => {
    const now = new Date();

    const users = await step.run("find-expired-subs", async () => {
      return await User.find({
        status: "active",
        subscriptionEndDate: { $lte: now },
        isDeleted: false,
      }).select("_id");
    });

    if (!users.length) {
      console.log("No subscriptions expired");
      return;
    }

    await step.run("update-subscription-status", async () => {
      return await User.updateMany(
        { _id: { $in: users.map(u => u._id) } },
        {
          status: "expired"
        }
      );
    });

    console.log("Subscriptions expired:", users.length);
  }
);