const { create, deleteById, findOne, isUuid, list } = require("../utils/supabaseData");

async function subscribeNewsletter(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const source = String(req.body.source || "website").trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required."
      });
    }

    const existingLead = await findOne("newsletter", { email });

    if (existingLead) {
      return res.status(200).json({
        success: true,
        message: "This email is already subscribed.",
        data: existingLead
      });
    }

    const lead = await create("newsletter", { email, source });

    return res.status(201).json({
      success: true,
      message: "Newsletter signup successful.",
      data: lead
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to save newsletter lead."
    });
  }
}

async function getNewsletterLeads(req, res) {
  try {
    const leads = await list("newsletter", {
      order: [{ column: "created_at", ascending: false }]
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch newsletter leads."
    });
  }
}

async function deleteNewsletterLead(req, res) {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid newsletter lead id."
      });
    }

    const lead = await deleteById("newsletter", id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Newsletter lead not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Newsletter lead deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete newsletter lead."
    });
  }
}

module.exports = {
  subscribeNewsletter,
  getNewsletterLeads,
  deleteNewsletterLead
};

