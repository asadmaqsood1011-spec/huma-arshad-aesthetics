const express = require("express");
const {
  getPublicTestimonials,
  getAdminTestimonials,
  getPublicTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require("../controllers/testimonialController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicTestimonials);
router.get("/admin/all", protectAdmin, getAdminTestimonials);
router.get("/:id", getPublicTestimonial);
router.post("/", protectAdmin, createTestimonial);
router.patch("/:id", protectAdmin, updateTestimonial);
router.delete("/:id", protectAdmin, deleteTestimonial);

module.exports = router;
