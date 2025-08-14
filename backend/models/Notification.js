const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const Disaster = require('./Disaster');

class Notification extends Model {}

Notification.init({
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('disaster_alert', 'status_update', 'assignment', 'system', 'emergency'),
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
});

// Recipient (User)
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
// Related Disaster (optional)
Notification.belongsTo(Disaster, { as: 'relatedDisaster', foreignKey: 'relatedDisasterId' });

module.exports = Notification; 