const mongoose = require("mongoose");

const resultCaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
    clientAlias: {
      type: String,
      default: "",
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    beforeImageUrl: {
      type: String,
      default: ""
    },
    afterImageUrl: {
      type: String,
      default: ""
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

module.exports = mongoose.model("ResultCase", resultCaseSchema);
