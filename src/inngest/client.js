import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "resqfood-startup-backend",
  eventKey: process.env.INNGEST_EVENT_KEY,
});