const express = require("express");
const {
  getPublicResults,
  getAdminResults,
  getPublicResult,
  createResult,
  updateResult,
  deleteResult
} = require("../controllers/resultController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicResults);
router.get("/admin/all", protectAdmin, getAdminResults);
router.get("/:id", getPublicResult);
router.post("/", protectAdmin, createResult);
router.patch("/:id", protectAdmin, updateResult);
router.delete("/:id", protectAdmin, deleteResult);

module.exports = router;
