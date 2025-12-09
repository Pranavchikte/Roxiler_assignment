const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getOwnerDashboard,
  updateOwnerPassword,
} = require("../controllers/storeOwnerController");

// Protect all store owner routes
router.use(protect);
router.use(authorize(["STORE_OWNER"]));

// Dashboard - view ratings and average
router.get("/dashboard", getOwnerDashboard);

// Update password
router.put("/password", updateOwnerPassword);

module.exports = router;
