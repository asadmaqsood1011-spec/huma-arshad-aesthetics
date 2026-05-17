const { create, deleteById, isUuid, list, updateById } = require("../utils/supabaseData");

async function getPublicAvailability(req, res) {
  try {
    const filters = {};

    if (req.query.date) {
      filters.date = String(req.query.date).trim();
    }

    if (req.query.includeUnavailable !== "true") {
      filters.available = true;
    }

    const slots = await list("availability", {
      filters,
      order: [
        { column: "date", ascending: true },
        { column: "time", ascending: true }
      ]
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
    const slots = await list("availability", {
      order: [
        { column: "date", ascending: true },
        { column: "time", ascending: true }
      ]
    });

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

    const slot = await create("availability", {
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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability slot id."
      });
    }

    const slot = await updateById("availability", id, req.body);

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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability slot id."
      });
    }

    const slot = await deleteById("availability", id);

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

