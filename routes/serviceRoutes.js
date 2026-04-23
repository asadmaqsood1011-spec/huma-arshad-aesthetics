const express = require("express");
const {
  getPublicServices,
  getAdminServices,
  getPublicService,
  createService,
  updateService,
  deleteService
} = require("../controllers/serviceController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicServices);
router.get("/admin/all", protectAdmin, getAdminServices);
router.get("/:identifier", getPublicService);
router.post("/", protectAdmin, createService);
router.patch("/:id", protectAdmin, updateService);
router.delete("/:id", protectAdmin, deleteService);

module.exports = router;
