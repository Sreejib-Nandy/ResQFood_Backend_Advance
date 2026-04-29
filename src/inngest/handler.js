import { serve } from "inngest/express";
import { inngest } from "./client.js";

import { expireFoods } from "./functions/expireFoods.js";
import { cleanupExpiredFoods } from "./functions/cleanupExpiredFoods.js";
import { expireTrialUsers } from "./functions/trialExpiry.js";
import { expireSubscriptions } from "./functions/subscriptionExpiry.js";
import { expirePendingClaims } from "./functions/expirePendingClaims.js";
import { expireUncollectedFood } from "./functions/expireUncollectedFood.js";

export const inngestHandler = serve({
  client: inngest,
  functions: [
    expireFoods,
    cleanupExpiredFoods,
    expireTrialUsers,
    expireSubscriptions,
    expirePendingClaims,
    expireUncollectedFood
  ],
});
