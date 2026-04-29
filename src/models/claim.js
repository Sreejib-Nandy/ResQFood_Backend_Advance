import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  foodPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodPost",
    required: true
  },

  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "collected", "expired"],
    default: "pending"
  },

  message: String,

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000)
  },

  // minimal additions
  acceptedAt: Date,
  rejectedAt: Date

}, { timestamps: true });


// prevent duplicate claim from same NGO
claimSchema.index({ foodPostId: 1, ngoId: 1 }, { unique: true });
claimSchema.index({ restaurantId: 1, status: 1 });
claimSchema.index({ ngoId: 1, status: 1 });

export default mongoose.model("ClaimFood", claimSchema);