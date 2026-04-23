const express = require("express");
const { loginAdmin, getCurrentAdmin } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getCurrentAdmin);

module.exports = router;
