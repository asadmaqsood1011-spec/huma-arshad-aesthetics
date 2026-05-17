const jwt = require("jsonwebtoken");
const { findById } = require("../utils/supabaseData");

async function protectAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id === "env-admin" && process.env.ADMIN_EMAIL) {
      req.admin = {
        id: "env-admin",
        email: process.env.ADMIN_EMAIL,
        fullName: process.env.ADMIN_FULL_NAME || "Huma Arshad Admin",
        role: "admin",
        createdAt: null
      };
      return next();
    }

    const admin = await findById("admins", decoded.id);

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin access denied."
      });
    }

    req.admin = {
      id: admin._id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      createdAt: admin.createdAt
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
}

module.exports = { protectAdmin };
