const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define("Report", {
  reportNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  reportContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reportMedia: {
    type: DataTypes.BLOB("medium"),
    allowNull: false
  }
});

module.exports = Report;
