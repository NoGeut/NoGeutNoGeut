const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Matching = sequelize.define("Matching", {
  matchingNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  promiseNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reportNum: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  depositStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reportStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Matching;
