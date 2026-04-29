import mongoose from "mongoose";

const foodPostSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  food_name: {
    type: String,
    required: true,
    trim: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  unit: {
    type: String,
    enum: ["kg", "plates", "packets", "boxes", "litres"],
    default: "plates"
  },

  description: {
    type: String,
    trim: true
  },

  expiry_time: {
    type: Date,
    required: true,
    index: true
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: val => Array.isArray(val) && val.length === 2,
        message: "Coordinates must be [lng, lat]"
      }
    }
  },

  status: {
    type: String,
    enum: ["available", "claimed", "accepted", "rejected", "collected", "expired"],
    default: "available",
    index: true
  },

  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true
  },

  food_image: {
    type: [
      {
        url: String,
        public_id: String
      }
    ],
    default: []
  },

  claimedAt: Date,
  collectedAt: Date,
  expiredAt: Date,

}, { timestamps: true });

foodPostSchema.index({ location: "2dsphere" });
foodPostSchema.index({ status: 1, expiry_time: 1 });
foodPostSchema.index({ restaurantId: 1, status: 1 });
foodPostSchema.index({ claimedBy: 1, status: 1 });

export default mongoose.model("FoodPost", foodPostSchema);