const path = require("path");
const express = require("express");

const app = require("./app");

const PORT = process.env.PORT || 5000;
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
