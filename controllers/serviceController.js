const mongoose = require("mongoose");
const Service = require("../models/Service");

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getPublicServices(req, res) {
  try {
    const services = await Service.find({ active: true }).sort({
      displayOrder: 1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch services."
    });
  }
}

async function getAdminServices(req, res) {
  try {
    const services = await Service.find().sort({
      displayOrder: 1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin services."
    });
  }
}

async function getPublicService(req, res) {
  try {
    const { identifier } = req.params;
    const query = mongoose.isValidObjectId(identifier)
      ? { _id: identifier, active: true }
      : { slug: identifier.toLowerCase(), active: true };

    const service = await Service.findOne(query);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch service."
    });
  }
}

async function createService(req, res) {
  try {
    const title = String(req.body.title || "").trim();
    const slug = slugify(req.body.slug || title);

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "title and slug are required."
      });
    }

    const existingService = await Service.findOne({ slug });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists."
      });
    }

    const service = await Service.create({
      title,
      slug,
      shortDescription: String(req.body.shortDescription || "").trim(),
      fullDescription: String(req.body.fullDescription || "").trim(),
      category: String(req.body.category || "").trim(),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      featured: Boolean(req.body.featured),
      active: req.body.active !== undefined ? Boolean(req.body.active) : true,
      displayOrder: Number(req.body.displayOrder || 0)
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create service."
    });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service id."
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    if (req.body.title !== undefined) {
      service.title = String(req.body.title).trim();
    }

    if (req.body.slug !== undefined || req.body.title !== undefined) {
      service.slug = slugify(req.body.slug || service.title);
    }

    if (req.body.shortDescription !== undefined) {
      service.shortDescription = String(req.body.shortDescription).trim();
    }

    if (req.body.fullDescription !== undefined) {
      service.fullDescription = String(req.body.fullDescription).trim();
    }

    if (req.body.category !== undefined) {
      service.category = String(req.body.category).trim();
    }

    if (req.body.tags !== undefined) {
      service.tags = Array.isArray(req.body.tags) ? req.body.tags : service.tags;
    }

    if (req.body.featured !== undefined) {
      service.featured = Boolean(req.body.featured);
    }

    if (req.body.active !== undefined) {
      service.active = Boolean(req.body.active);
    }

    if (req.body.displayOrder !== undefined) {
      service.displayOrder = Number(req.body.displayOrder);
    }

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: service
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update service."
    });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service id."
      });
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete service."
    });
  }
}

module.exports = {
  getPublicServices,
  getAdminServices,
  getPublicService,
  createService,
  updateService,
  deleteService
};
