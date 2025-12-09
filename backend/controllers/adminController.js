const { User, Store, Rating } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Add new user (admin can create any role)
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Role validation
    if (!["ADMIN", "NORMAL_USER", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ error: "Invalid Role" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create user (password hashing handled by model hook)
    const newUser = await User.create({
      name,
      email,
      password,
      address,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
    });
  } catch (err) {
    // Handle validation errors from Sequelize
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Add new store
const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if owner exists and is a STORE_OWNER
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (owner.role !== "STORE_OWNER") {
      return res.status(400).json({ error: "User is not a Store Owner" });
    }

    // Check if email already exists
    const storeExists = await Store.findOne({ where: { email } });
    if (storeExists) {
      return res.status(400).json({ error: "Store email already exists" });
    }

    // Create store
    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({
      message: "Store created successfully",
      store: newStore,
    });
  } catch (err) {
    // Handle validation errors from Sequelize
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all stores with filtering, sorting, and rating calculation
const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

    // Build filter conditions
    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    // Validate sortBy field
    const allowedSortFields = ["name", "email", "address"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";

    // Validate order
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Fetch stores with ratings
    const stores = await Store.findAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn("AVG", sequelize.col("Ratings.rating")),
            "averageRating",
          ],
        ],
      },
      group: ["Store.id"],
    });

    res.json({ stores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users with filtering and sorting
const getAllUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "ASC",
    } = req.query;

    // Build filter conditions
    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (role) whereClause.role = role;

    // Validate sortBy field
    const allowedSortFields = ["name", "email", "address", "role"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";

    // Validate order
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Fetch users
    const users = await User.findAll({
      where: whereClause,
      order: [[sortField, sortOrder]],
      attributes: { exclude: ["password"] }, // Don't send passwords
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user details by ID (including store rating if store owner)
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "email", "address"],
          include: [
            {
              model: Rating,
              attributes: [],
            },
          ],
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is a store owner, calculate average rating
    let storeRating = null;
    if (user.role === "STORE_OWNER" && user.store) {
      const ratings = await Rating.findAll({
        where: { storeId: user.store.id },
        attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avg"]],
        raw: true,
      });
      storeRating = ratings[0]?.avg || 0;
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        store: user.store || null,
        storeRating: storeRating,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getAllStores,
  getAllUsers,
  getUserDetails,
};
