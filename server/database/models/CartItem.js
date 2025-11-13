// server/database/models/Cartitem.js
const { sequelize } = require('../Server');
const { DataTypes } = require('sequelize');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      },
      isInt: {
        msg: 'Quantity must be an integer'
      }
    }
  },
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


module.exports = CartItem;