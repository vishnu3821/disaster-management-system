const { Sequelize } = require('sequelize');

// Use environment variables for database configuration
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DB_NAME || 'disaster_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Vishnu@1720',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      freezeTableName: true,
      timestamps: true
    },
    // For Railway deployment without database
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize; 