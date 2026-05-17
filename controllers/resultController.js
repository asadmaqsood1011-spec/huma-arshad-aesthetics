const { create, deleteById, findById, isUuid, list, updateById } = require("../utils/supabaseData");

async function getPublicResults(req, res) {
  try {
    const results = await list("results", {
      filters: { published: true },
      order: [
        { column: "featured", ascending: false },
        { column: "created_at", ascending: false }
      ]
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch result cases."
    });
  }
}

async function getAdminResults(req, res) {
  try {
    const results = await list("results", {
      order: [{ column: "created_at", ascending: false }]
    });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin results."
    });
  }
}

async function getPublicResult(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result case id."
      });
    }

    const result = await findById("results", id, { published: true });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result case not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch result case."
    });
  }
}

async function createResult(req, res) {
  try {
    const title = String(req.body.title || "").trim();
    const service = String(req.body.service || "").trim();

    if (!title || !service) {
      return res.status(400).json({
        success: false,
        message: "title and service are required."
      });
    }

    const result = await create("results", {
      title,
      service,
      clientAlias: String(req.body.clientAlias || "").trim(),
      description: String(req.body.description || "").trim(),
      beforeImageUrl: String(req.body.beforeImageUrl || "").trim(),
      afterImageUrl: String(req.body.afterImageUrl || "").trim(),
      featured: Boolean(req.body.featured),
      published: req.body.published !== undefined ? Boolean(req.body.published) : true
    });

    return res.status(201).json({
      success: true,
      message: "Result case created successfully.",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create result case."
    });
  }
}

async function updateResult(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result case id."
      });
    }

    const result = await updateById("results", id, req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result case not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result case updated successfully.",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update result case."
    });
  }
}

async function deleteResult(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result case id."
      });
    }

    const result = await deleteById("results", id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result case not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result case deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete result case."
    });
  }
}

module.exports = {
  getPublicResults,
  getAdminResults,
  getPublicResult,
  createResult,
  updateResult,
  deleteResult
};

