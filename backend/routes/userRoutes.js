const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAllStoresForUser,
  submitRating,
  updatePassword,
} = require("../controllers/userController");

// Protect all user routes
router.use(protect);
router.use(authorize(["NORMAL_USER"]));

// View stores
router.get("/stores", getAllStoresForUser);

// Submit or update rating
router.post("/ratings", submitRating);

// Update password
router.put("/password", updatePassword);

module.exports = router;
