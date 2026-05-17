const { create, deleteById, findById, findOne, isUuid, list, updateById } = require("../utils/supabaseData");

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getPublicServices(req, res) {
  try {
    const services = await list("services", {
      filters: { active: true },
      order: [
        { column: "display_order", ascending: true },
        { column: "created_at", ascending: false }
      ]
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
    const services = await list("services", {
      order: [
        { column: "display_order", ascending: true },
        { column: "created_at", ascending: false }
      ]
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
    const service = isUuid(identifier)
      ? await findById("services", identifier, { active: true })
      : await findOne("services", { slug: identifier.toLowerCase(), active: true });

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

    const existingService = await findOne("services", { slug });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "A service with this slug already exists."
      });
    }

    const service = await create("services", {
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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service id."
      });
    }

    const existing = await findById("services", id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Service not found."
      });
    }

    const payload = {};

    if (req.body.title !== undefined) payload.title = String(req.body.title).trim();
    if (req.body.slug !== undefined || req.body.title !== undefined) payload.slug = slugify(req.body.slug || payload.title || existing.title);
    if (req.body.shortDescription !== undefined) payload.shortDescription = String(req.body.shortDescription).trim();
    if (req.body.fullDescription !== undefined) payload.fullDescription = String(req.body.fullDescription).trim();
    if (req.body.category !== undefined) payload.category = String(req.body.category).trim();
    if (req.body.tags !== undefined) payload.tags = Array.isArray(req.body.tags) ? req.body.tags : existing.tags;
    if (req.body.featured !== undefined) payload.featured = Boolean(req.body.featured);
    if (req.body.active !== undefined) payload.active = Boolean(req.body.active);
    if (req.body.displayOrder !== undefined) payload.displayOrder = Number(req.body.displayOrder);

    const service = await updateById("services", id, payload);

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: service
    });
  } catch (error) {
    if (error.code === "23505") {
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

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service id."
      });
    }

    const service = await deleteById("services", id);

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

