const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true
    },
    time: {
      type: String,
      required: true,
      trim: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AvailabilitySlot", availabilitySlotSchema);
