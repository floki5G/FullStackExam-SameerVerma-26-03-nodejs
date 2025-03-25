import Order from '../models/sql/Order.js';
import Product from '../models/mongodb/Product.js';

// @desc    Get daily revenue for the last 7 days
// @route   GET /api/reports/daily-revenue
// @access  Private/Admin
const getDailyRevenue = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 7;
    
    const dailyRevenue = await Order.getDailyRevenue(days);
    
    res.status(200).json({
      success: true,
      data: dailyRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get top spenders
// @route   GET /api/reports/top-spenders
// @access  Private/Admin
const getTopSpenders = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    
    const topSpenders = await Order.getTopSpenders(limit);
    
    res.status(200).json({
      success: true,
      data: topSpenders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get sales by category
// @route   GET /api/reports/sales-by-category
// @access  Private/Admin
const getSalesByCategory = async (req, res) => {
  try {
    const salesByCategory = await Product.getSalesByCategory();
    
    res.status(200).json({
      success: true,
      data: salesByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get monthly sales
// @route   GET /api/reports/monthly-sales
// @access  Private/Admin
const getMonthlySales = async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    
    const monthlySales = await sequelize.query(`
      SELECT 
        MONTH(createdAt) as month,
        SUM(totalAmount) as revenue,
        COUNT(id) as orderCount
      FROM Orders
      WHERE YEAR(createdAt) = ${year}
      GROUP BY MONTH(createdAt)
      ORDER BY month
    `, { type: sequelize.QueryTypes.SELECT });
    
    res.status(200).json({
      success: true,
      data: monthlySales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export { getDailyRevenue, getTopSpenders, getSalesByCategory, getMonthlySales };