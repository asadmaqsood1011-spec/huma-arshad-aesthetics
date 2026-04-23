const express = require("express");
const { getPublicSettings, updateSettings } = require("../controllers/settingController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicSettings);
router.put("/", protectAdmin, updateSettings);

module.exports = router;
