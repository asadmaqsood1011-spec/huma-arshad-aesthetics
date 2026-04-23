const express = require("express");
const {
  getPublicAvailability,
  getAdminAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability
} = require("../controllers/availabilityController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicAvailability);
router.get("/admin/all", protectAdmin, getAdminAvailability);
router.post("/", protectAdmin, createAvailability);
router.patch("/:id", protectAdmin, updateAvailability);
router.delete("/:id", protectAdmin, deleteAvailability);

module.exports = router;
