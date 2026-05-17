const { create, deleteById, findById, isUuid, list, updateById } = require("../utils/supabaseData");

async function getPublicTestimonials(req, res) {
  try {
    const testimonials = await list("testimonials", {
      filters: { published: true },
      order: [
        { column: "featured", ascending: false },
        { column: "created_at", ascending: false }
      ]
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
    const testimonials = await list("testimonials", {
      order: [{ column: "created_at", ascending: false }]
    });

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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await findById("testimonials", id, { published: true });

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

    const testimonial = await create("testimonials", {
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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await updateById("testimonials", id, req.body);

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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial id."
      });
    }

    const testimonial = await deleteById("testimonials", id);

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

