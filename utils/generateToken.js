const jwt = require("jsonwebtoken");

function generateToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

module.exports = generateToken;
