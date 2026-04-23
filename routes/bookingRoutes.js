const express = require("express");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} = require("../controllers/bookingController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createBooking);
router.get("/", protectAdmin, getBookings);
router.get("/:id", protectAdmin, getBookingById);
router.patch("/:id/status", protectAdmin, updateBookingStatus);
router.delete("/:id", protectAdmin, deleteBooking);

module.exports = router;
