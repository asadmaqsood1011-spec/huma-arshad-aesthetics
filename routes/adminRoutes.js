const express = require("express");
const { getDashboardData } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protectAdmin, getDashboardData);

module.exports = router;
