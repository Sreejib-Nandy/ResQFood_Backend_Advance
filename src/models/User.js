import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },

  password: {
    type: String,
    required: function () {
      return this.provider === "email";
    }
  },

  // OPTIONAL image (no need to require)
  image: {
    type: String,
    default: null
  },

  provider: {
    type: String,
    enum: ["google", "email"],
    required: true
  },

  role: {
    type: String,
    enum: ["restaurant", "ngo"],
    required: function () {
      return this.isProfileComplete;
    }
  },

  address: {
    type: String,
    required: function () {
      return this.isProfileComplete;
    }
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: null,
      validate: {
        validator: function (val) {
          if (!this.isProfileComplete) return true;
          return Array.isArray(val) && val.length === 2;
        },
        message: "Coordinates must be [lng, lat]"
      }
    }
  },

  contactInfo: {
    type: String,
    required: function () {
      return this.isProfileComplete;
    }
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },

  // Trial tracking
  hasUsedTrial: {
    type: Boolean,
    default: false
  },

  trialStartDate: Date,
  trialEndDate: Date,

  // Subscription
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,

  status: {
    type: String,
    enum: ["trial", "active", "expired", "none"],
    default: "none"
  },

  // Razorpay integration
  // razorpayCustomerId: String,
  // razorpaySubscriptionId: String,
  razorpayPaymentId: String,

  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });


// Indexes
userSchema.index({ location: "2dsphere" });
userSchema.index({ status: 1, role: 1 });

export default mongoose.model("User", userSchema);