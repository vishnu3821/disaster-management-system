const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

class Disaster extends Model {}

Disaster.init({
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('flood', 'earthquake', 'fire', 'hurricane', 'other'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
  },
  location_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location_lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location_lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'resolved'),
    defaultValue: 'pending',
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs
    allowNull: true,
  },
  estimatedCasualties: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  estimatedDamage: {
    type: DataTypes.ENUM('minimal', 'moderate', 'significant', 'severe'),
    allowNull: true,
  },
  emergencyContacts: {
    type: DataTypes.JSON, // Array of contacts
    allowNull: true,
  },
  notes: {
    type: DataTypes.JSON, // Array of notes
    allowNull: true,
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Disaster',
  tableName: 'disasters',
});

// Reporter (User)
Disaster.belongsTo(User, { as: 'reportedBy', foreignKey: 'reportedById' });
// Volunteer assigned (User)
Disaster.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

module.exports = Disaster; 