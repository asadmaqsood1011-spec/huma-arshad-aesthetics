const mongoose = require("mongoose");
const Testimonial = require("../models/Testimonial");

async function getPublicTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({
      featured: -1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch testimonials."
    });
  }
}

async function getAdminTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin testimonials."
    });
  }
}

async function getPublicTestimonial(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await Testimonial.findOne({ _id: id, published: true });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch testimonial."
    });
  }
}

async function createTestimonial(req, res) {
  try {
    const clientName = String(req.body.clientName || "").trim();
    const quote = String(req.body.quote || "").trim();

    if (!clientName || !quote) {
      return res.status(400).json({
        success: false,
        message: "clientName and quote are required."
      });
    }

    const testimonial = await Testimonial.create({
      clientName,
      rating: Number(req.body.rating || 5),
      quote,
      service: String(req.body.service || "").trim(),
      featured: Boolean(req.body.featured),
      published: req.body.published !== undefined ? Boolean(req.body.published) : true
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: testimonial
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create testimonial."
    });
  }
}

async function updateTestimonial(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: testimonial
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update testimonial."
    });
  }
}

async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete testimonial."
    });
  }
}

module.exports = {
  getPublicTestimonials,
  getAdminTestimonials,
  getPublicTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
