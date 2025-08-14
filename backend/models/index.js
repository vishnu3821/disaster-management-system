const sequelize = require('../config/sequelize');
const User = require('./User');
const Disaster = require('./Disaster');
const Notification = require('./Notification');

// Associations (already defined in model files, but can be repeated here if needed)
// Disaster.belongsTo(User, { as: 'reportedBy', foreignKey: 'reportedById' });
// Disaster.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });
// Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
// Notification.belongsTo(Disaster, { as: 'relatedDisaster', foreignKey: 'relatedDisasterId' });

const syncAll = async () => {
  await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
  console.log('All models were synchronized successfully.');
};

module.exports = {
  sequelize,
  User,
  Disaster,
  Notification,
  syncAll,
}; 