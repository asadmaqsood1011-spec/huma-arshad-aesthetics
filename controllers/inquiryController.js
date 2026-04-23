const mongoose = require("mongoose");
const ContactInquiry = require("../models/ContactInquiry");
const { sendInquiryNotification } = require("../utils/sendEmail");

const allowedStatuses = ["unread", "read", "replied"];

async function createInquiry(req, res) {
  try {
    const payload = {
      fullName: String(req.body.fullName || "").trim(),
      email: String(req.body.email || "").trim().toLowerCase(),
      phone: String(req.body.phone || "").trim(),
      subject: String(req.body.subject || "").trim(),
      message: String(req.body.message || "").trim()
    };

    if (!payload.fullName || !payload.email || !payload.message) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and message are required."
      });
    }

    const inquiry = await ContactInquiry.create(payload);

    try {
      await sendInquiryNotification(inquiry);
    } catch (emailError) {
      console.error("Inquiry notification email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Contact inquiry submitted successfully.",
      data: inquiry
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create contact inquiry."
    });
  }
}

async function getInquiries(req, res) {
  try {
    const filters = {};

    if (req.query.status && allowedStatuses.includes(req.query.status)) {
      filters.status = req.query.status;
    }

    const inquiries = await ContactInquiry.find(filters).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch inquiries."
    });
  }
}

async function getInquiryById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry id."
      });
    }

    const inquiry = await ContactInquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch inquiry."
    });
  }
}

async function updateInquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const status = String(req.body.status || "").trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry id."
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status."
      });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully.",
      data: inquiry
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update inquiry status."
    });
  }
}

async function deleteInquiry(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry id."
      });
    }

    const inquiry = await ContactInquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete inquiry."
    });
  }
}

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
};
