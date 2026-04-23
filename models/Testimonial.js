const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    quote: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      default: "",
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
