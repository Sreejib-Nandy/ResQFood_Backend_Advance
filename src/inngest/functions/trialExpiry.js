import { inngest } from "../client.js";
import User from "../../models/User.js";

export const expireTrialUsers = inngest.createFunction(
  {
    id: "expire-trial-users",
    triggers: [{cron: "0 2 * * *"}] // daily at 2 AM
  },
  async ({ step }) => {
    const now = new Date();

    const users = await step.run("find-expired-trials", async () => {
      return await User.find({
        status: "trial",
        trialEndDate: { $lte: now },
        isDeleted: false,
      }).select("_id");
    });

    if (!users.length) {
      console.log("No trial users expired");
      return;
    }

    await step.run("update-trial-status", async () => {
      return await User.updateMany(
        { _id: { $in: users.map(u => u._id) } },
        {
          status: "expired",
        }
      );
    });

    console.log("Trial expired users:", users.length);
  }
);