// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../../config/db');
// const User = require('./User');
import { DataTypes } from 'sequelize';
import {
  sequelize
} from '../../config/db.js';
import User from './User.js';
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
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
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

// Advanced query: Get daily revenue for the last 7 days
Order.getDailyRevenue = async function(days = 7) {
  const result = await sequelize.query(`
    SELECT 
      DATE(createdAt) as date,
      SUM(totalAmount) as revenue
    FROM Orders
    WHERE createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL ${days} DAY)
    GROUP BY DATE(createdAt)
    ORDER BY date DESC
  `, { type: sequelize.QueryTypes.SELECT });
  
  return result;
};

// Get top spenders
Order.getTopSpenders = async function(limit = 3) {
  const result = await sequelize.query(`
    SELECT 
      Users.id, 
      Users.name, 
      Users.email,
      SUM(Orders.totalAmount) as totalSpent,
      COUNT(Orders.id) as orderCount
    FROM Orders
    JOIN Users ON Orders.userId = Users.id
    GROUP BY Users.id
    ORDER BY totalSpent DESC
    LIMIT ${limit}
  `, { type: sequelize.QueryTypes.SELECT });
  
  return result;
};

export default Order;