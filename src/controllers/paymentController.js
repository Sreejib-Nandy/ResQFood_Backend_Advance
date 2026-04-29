import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

// CREATE ORDER
export const createOrderController = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 29900, // ₹299
      currency: "INR",
      receipt: `receipt_${req.user.userId}`,
      notes: {
        userId: req.user.userId.toString(), // important
      },
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).send("Error creating order");
  }
};

// WEBHOOK HANDLER
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // verify signature (RAW body required)
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body.toString()); // raw body
    const digest = shasum.digest("hex");

    const signature = req.headers["x-razorpay-signature"];

    if (digest !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());
    console.log("Webhook event:", event.event);

    // handle payment success
    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;

      if (!payment) {
        return res.status(400).send("Invalid payload");
      }

      const userId = payment.notes?.userId;

      if (!userId) {
        return res.status(400).send("UserId missing in notes");
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      // prevent duplicate processing
      if (
        user.razorpayPaymentId &&
        user.razorpayPaymentId === payment.id
      ) {
        return res.json({ status: "already processed" });
      }

      const now = new Date();

      // extend or create subscription
      if (user.subscriptionEndDate && user.subscriptionEndDate > now) {
        user.subscriptionEndDate = new Date(
          user.subscriptionEndDate.getTime() +
            30 * 24 * 60 * 60 * 1000
        );
      } else {
        user.subscriptionStartDate = now;
        user.subscriptionEndDate = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
      }

      user.status = "active";
      user.razorpayPaymentId = payment.id;

      await user.save();
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook Error");
  }
};