const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  addUser,
  addStore,
  getAllStores,
  getAllUsers,
  getUserDetails,
} = require("../controllers/adminController");

// Protect all admin routes
router.use(protect);
router.use(authorize(["ADMIN"]));

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// User management
router.post("/users", addUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);

// Store management
router.post("/stores", addStore);
router.get("/stores", getAllStores);

module.exports = router;
