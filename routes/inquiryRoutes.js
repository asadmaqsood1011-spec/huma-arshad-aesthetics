const express = require("express");
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
} = require("../controllers/inquiryController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createInquiry);
router.get("/", protectAdmin, getInquiries);
router.get("/:id", protectAdmin, getInquiryById);
router.patch("/:id/status", protectAdmin, updateInquiryStatus);
router.delete("/:id", protectAdmin, deleteInquiry);

module.exports = router;
