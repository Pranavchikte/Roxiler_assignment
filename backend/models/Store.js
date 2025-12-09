const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [20, 60],
        msg: "Store name must be between 20 and 60 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [0, 400],
        msg: "Address must not exceed 400 characters",
      },
    },
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = Store;
