const mongoose = require("mongoose");

const newsletterLeadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
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

module.exports = mongoose.model("NewsletterLead", newsletterLeadSchema);
