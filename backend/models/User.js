const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
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
          msg: "Name must be between 20 and 60 characters",
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidPassword(value) {
          // 8-16 characters, at least 1 uppercase, 1 special character
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
          if (!passwordRegex.test(value)) {
            throw new Error(
              "Password must be 8-16 characters long, include at least one uppercase letter and one special character"
            );
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 400],
          msg: "Address must not exceed 400 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "NORMAL_USER", "STORE_OWNER"),
      defaultValue: "NORMAL_USER",
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
