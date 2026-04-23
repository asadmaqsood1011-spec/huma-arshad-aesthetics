const SiteSetting = require("../models/SiteSetting");

async function getPublicSettings(req, res) {
  try {
    const settings = await SiteSetting.findOne().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: settings || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch site settings."
    });
  }
}

async function updateSettings(req, res) {
  try {
    const payload = {
      businessName: req.body.businessName,
      instagramUrl: req.body.instagramUrl,
      whatsappUrl: req.body.whatsappUrl,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      consultationCtaText: req.body.consultationCtaText,
      bookingLink: req.body.bookingLink
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const settings = await SiteSetting.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });

    return res.status(200).json({
      success: true,
      message: "Site settings updated successfully.",
      data: settings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update site settings."
    });
  }
}

module.exports = {
  getPublicSettings,
  updateSettings
};
