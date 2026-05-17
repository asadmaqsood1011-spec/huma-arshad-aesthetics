const { create, deleteById, findById, isUuid, list, updateById } = require("../utils/supabaseData");
const { sendBookingNotification } = require("../utils/sendEmail");

const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

async function createBooking(req, res) {
  try {
    const payload = {
      fullName: String(req.body.fullName || "").trim(),
      email: String(req.body.email || "").trim().toLowerCase(),
      phone: String(req.body.phone || "").trim(),
      service: String(req.body.service || "").trim(),
      preferredDate: String(req.body.preferredDate || "").trim(),
      preferredTime: String(req.body.preferredTime || "").trim(),
      message: String(req.body.message || "").trim(),
      source: String(req.body.source || "website").trim()
    };

    if (!payload.fullName || !payload.email || !payload.phone || !payload.service) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, phone, and service are required."
      });
    }

    const booking = await create("bookings", payload);

    try {
      await sendBookingNotification(booking);
    } catch (emailError) {
      console.error("Booking notification email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      data: booking
    });
  } catch (error) {
    console.error("Create booking failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create booking request."
    });
  }
}

async function getBookings(req, res) {
  try {
    const filters = {};

    if (req.query.status && allowedStatuses.includes(req.query.status)) {
      filters.status = req.query.status;
    }

    const bookings = await list("bookings", {
      filters,
      order: [{ column: "created_at", ascending: false }]
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking requests."
    });
  }
}

async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking request id."
      });
    }

    const booking = await findById("bookings", id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking request."
    });
  }
}

async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const status = String(req.body.status || "").trim();

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking request id."
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status."
      });
    }

    const booking = await updateById("bookings", id, { status });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update booking status."
    });
  }
}

async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking request id."
      });
    }

    const booking = await deleteById("bookings", id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking request deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete booking request."
    });
  }
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};

