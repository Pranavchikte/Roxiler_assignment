const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes - NO middleware here
app.use("/api/auth", authRoutes); // No protect middleware
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is live and running...");
});

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Connected to Postgres. Tables synced.");
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
