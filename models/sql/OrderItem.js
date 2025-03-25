// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../../config/db');
// const Order = require('./Order');
import { DataTypes } from 'sequelize';
import {
  sequelize
} from '../../config/db.js';
import Order from './Order.js';
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.STRING,  // MongoDB ObjectId as string
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define relationships
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

// Method to create multiple order items
OrderItem.bulkCreateItems = async function(items) {
  return await OrderItem.bulkCreate(items);
};

// Method to get items for an order
OrderItem.getItemsByOrderId = async function(orderId) {
  return await OrderItem.findAll({ where: { orderId } });
};
 
export default OrderItem;