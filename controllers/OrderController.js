// const { sequelize } = require('../config/db');
// const Order = require('../models/sql/Order');
// const OrderItem = require('../models/sql/OrderItem');
// const Cart = require('../models/mongodb/Cart');
// const Product = require('../models/mongodb/Product');
import Order from '../models/sql/Order.js';
import OrderItem from '../models/sql/OrderItem.js';
import Cart from '../models/mongodb/Cart.js';
import Product from '../models/mongodb/Product.js';
import { sequelize } from '../config/db.js';
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and payment method'
      });
    }
    
    // Get user cart
    const cart = await Cart.getCartByUserId(req.user.id);
    
    // Check if cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }
    
    // Calculate total amount
    const totalAmount = cart.calculateTotal();
    
    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction });
    
    // Create order items
    const orderItems = cart.items.map(item => ({
      orderId: order.id,
      productId: item.productId.toString(),
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    
    await OrderItem.bulkCreate(orderItems, { transaction });
    
    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Clear cart
    await cart.clearCart();
    
    // Commit transaction
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: orderItems.length
      }
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user or user is admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
    // Get order items
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id }
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...order.toJSON(),
        items: orderItems
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update status if provided
    if (status) {
      order.status = status;
    }
    
    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export { createOrder, getMyOrders, getOrderById, updateOrderStatus };