const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Define associations
User.hasOne(Store, { foreignKey: "ownerId", as: "store" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
