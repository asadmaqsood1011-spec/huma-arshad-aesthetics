const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "Huma Arshad Aesthetics"
    },
    instagramUrl: {
      type: String,
      default: ""
    },
    whatsappUrl: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    consultationCtaText: {
      type: String,
      default: "Book Consultation"
    },
    bookingLink: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
