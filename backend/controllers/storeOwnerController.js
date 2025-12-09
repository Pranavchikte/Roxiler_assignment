const { User, Store, Rating } = require("../models");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");

// Get store owner's dashboard (ratings and average)
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find store owned by this user
    const store = await Store.findOne({ where: { ownerId } });

    if (!store) {
      return res.status(404).json({ error: "No store found for this owner" });
    }

    // Get all ratings for this store with user details
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "address"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate average rating
    const avgRating = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "average"]],
      raw: true,
    });

    const averageRating = avgRating?.average
      ? parseFloat(avgRating.average).toFixed(2)
      : 0;

    // Format response
    const userRatings = ratings.map((rating) => ({
      ratingId: rating.id,
      rating: rating.rating,
      submittedAt: rating.createdAt,
      user: {
        id: rating.User.id,
        name: rating.User.name,
        email: rating.User.email,
        address: rating.User.address,
      },
    }));

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: averageRating,
        totalRatings: ratings.length,
      },
      ratings: userRatings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update store owner's password
const updateOwnerPassword = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user
    const user = await User.findByPk(ownerId);
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
  getOwnerDashboard,
  updateOwnerPassword,
};
