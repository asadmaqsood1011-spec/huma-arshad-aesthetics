const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
    preferredDate: {
      type: String,
      default: ""
    },
    preferredTime: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },
    source: {
      type: String,
      default: "website"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
