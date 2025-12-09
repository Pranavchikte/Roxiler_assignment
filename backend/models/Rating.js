const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: "Rating must be at least 1",
      },
      max: {
        args: 5,
        msg: "Rating must not exceed 5",
      },
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Stores",
      key: "id",
    },
  },
});

module.exports = Rating;
