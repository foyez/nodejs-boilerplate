const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Course = sequelize.define(
  'Course',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // timestamps: false
  }
);

module.exports = Course;
