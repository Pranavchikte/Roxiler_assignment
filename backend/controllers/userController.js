const { User, Store, Rating } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

// Get all stores with ratings (including user's own rating if exists)
const getAllStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const { name, address } = req.query;

    // Build search conditions
    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    // Fetch all stores
    const stores = await Store.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "address"],
    });

    // For each store, calculate average rating and check user's rating
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        // Get average rating
        const avgRating = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg"]],
          raw: true,
        });

        // Get user's rating for this store
        const userRating = await Rating.findOne({
          where: { storeId: store.id, userId: userId },
          attributes: ["rating"],
          raw: true,
        });

        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          averageRating: avgRating?.avg
            ? parseFloat(avgRating.avg).toFixed(2)
            : 0,
          userRating: userRating?.rating || null,
        };
      })
    );

    res.json({ stores: storesWithRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit or update rating for a store
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    } else {
      // Create new rating
      const newRating = await Rating.create({
        userId,
        storeId,
        rating,
      });
      return res.status(201).json({
        message: "Rating submitted successfully",
        rating: newRating,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user's own password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password (will be hashed by model hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    // Handle validation errors
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStoresForUser,
  submitRating,
  updatePassword,
};
