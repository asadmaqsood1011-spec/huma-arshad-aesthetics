const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const settingRoutes = require("./routes/settingRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
const publicDir = path.join(__dirname, "public");

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(publicDir, "admin.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(publicDir, "admin.html"));
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
