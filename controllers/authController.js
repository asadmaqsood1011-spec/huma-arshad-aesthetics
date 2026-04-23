const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

async function loginAdmin(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to log in right now."
    });
  }
}

async function getCurrentAdmin(req, res) {
  return res.status(200).json({
    success: true,
    admin: req.admin
  });
}

module.exports = {
  loginAdmin,
  getCurrentAdmin
};
