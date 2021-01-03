"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Goal.belongsTo(models.User)
    }
  }
  Goal.init(
    {
      userId: DataTypes.INTEGER,
      goalText: DataTypes.TEXT,
      isComplete: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Goal",
    }
  );
  return Goal;
};
