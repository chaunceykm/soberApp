"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JournalEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JournalEntry.belongsTo(User, { as: "userId" });
    }
  }
  JournalEntry.init(
    {
      userId: DataTypes.INTEGER,
      mood: DataTypes.STRING,
      headline: DataTypes.STRING,
      entry: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "JournalEntry",
    }
  );
  return JournalEntry;
};
