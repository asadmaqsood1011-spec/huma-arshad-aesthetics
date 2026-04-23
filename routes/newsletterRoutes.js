const express = require("express");
const {
  subscribeNewsletter,
  getNewsletterLeads,
  deleteNewsletterLead
} = require("../controllers/newsletterController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", subscribeNewsletter);
router.get("/", protectAdmin, getNewsletterLeads);
router.delete("/:id", protectAdmin, deleteNewsletterLead);

module.exports = router;
