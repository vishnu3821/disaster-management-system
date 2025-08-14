const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('disaster_management', 'root', 'Vishnu@1720', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to true for SQL query logs
  define: {
    freezeTableName: true,
    timestamps: true
  }
});

module.exports = sequelize; 