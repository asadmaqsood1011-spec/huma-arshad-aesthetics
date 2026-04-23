const mongoose = require("mongoose");
const AvailabilitySlot = require("../models/AvailabilitySlot");

async function getPublicAvailability(req, res) {
  try {
    const filters = {};

    if (req.query.date) {
      filters.date = String(req.query.date).trim();
    }

    if (req.query.includeUnavailable === "true") {
      delete filters.available;
    } else {
      filters.available = true;
    }

    const slots = await AvailabilitySlot.find(filters).sort({
      date: 1,
      time: 1
    });

    return res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch availability slots."
    });
  }
}

async function getAdminAvailability(req, res) {
  try {
    const slots = await AvailabilitySlot.find().sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin availability slots."
    });
  }
}

async function createAvailability(req, res) {
  try {
    const date = String(req.body.date || "").trim();
    const time = String(req.body.time || "").trim();

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "date and time are required."
      });
    }

    const slot = await AvailabilitySlot.create({
      date,
      time,
      available: req.body.available !== undefined ? Boolean(req.body.available) : true
    });

    return res.status(201).json({
      success: true,
      message: "Availability slot created successfully.",
      data: slot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create availability slot."
    });
  }
}

async function updateAvailability(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability slot id."
      });
    }

    const slot = await AvailabilitySlot.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Availability slot not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Availability slot updated successfully.",
      data: slot
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update availability slot."
    });
  }
}

async function deleteAvailability(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability slot id."
      });
    }

    const slot = await AvailabilitySlot.findByIdAndDelete(id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Availability slot not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Availability slot deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete availability slot."
    });
  }
}

module.exports = {
  getPublicAvailability,
  getAdminAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability
};
