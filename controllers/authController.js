const bcrypt = require("bcryptjs");
const { findOne } = require("../utils/supabaseData");
const generateToken = require("../utils/generateToken");

async function loginAdmin(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const envAdminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envAdminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (
      envAdminEmail &&
      envAdminPasswordHash &&
      email === envAdminEmail &&
      (await bcrypt.compare(password, envAdminPasswordHash))
    ) {
      return res.status(200).json({
        success: true,
        message: "Admin login successful.",
        token: generateToken("env-admin"),
        admin: {
          id: "env-admin",
          email: envAdminEmail,
          fullName: process.env.ADMIN_FULL_NAME || "Huma Arshad Admin",
          role: "admin",
          createdAt: null
        }
      });
    }

    const admin = await findOne("admins", { email });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
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
