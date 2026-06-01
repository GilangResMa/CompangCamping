// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { router: authRoutes, authenticateToken } = require("./routes/auth");
const itemRoutes = require("./routes/items");
const rentalRoutes = require("./routes/rentals");
const fineRoutes = require("./routes/fines");
const conditionRoutes = require("./routes/conditions");
const categoryRoutes = require("./routes/categories");
const dashboardRoutes = require("./routes/dashboard");
const itemUnitRoutes = require("./routes/itemUnits");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes (hanya bisa diakses setelah login)
app.use("/api/items", authenticateToken, itemRoutes);
app.use("/api/rentals", authenticateToken, rentalRoutes);
app.use("/api/fines", authenticateToken, fineRoutes);
app.use("/api/conditions", authenticateToken, conditionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);
app.use("/api/item-units", authenticateToken, itemUnitRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Camping Rental API is running on GCP ✅" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
