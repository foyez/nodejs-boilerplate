const { Sequelize } = require('sequelize');
const path = require('path');

// Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  username: 'root',
  password: 'root',
  storage: path.join(__dirname, 'db.sqlite'),
  host: 'localhost',
  dialect: 'sqlite',
  logging: console.log
});

module.exports = sequelize;
