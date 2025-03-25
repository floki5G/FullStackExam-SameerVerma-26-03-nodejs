// const Cart = require('../models/mongodb/Cart');
// const Product = require('../models/mongodb/Product');
// const mongoose = require('mongoose');

 import Cart from '../models/mongodb/Cart.js';
import Product from '../models/mongodb/Product.js';
import mongoose from 'mongoose';
// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.getCartByUserId(req.user.id);
    
    res.status(200).json({
      success: true,
      data: cart,
      total: cart.calculateTotal()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if stock is available
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }
    
    // Get user cart
    const cart = await Cart.getCartByUserId(req.user.id);
    
    // Add item to cart
    await cart.addItem({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl
    });
    
    res.status(200).json({
      success: true,
      data: cart,
      total: cart.calculateTotal()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    // Get user cart
    const cart = await Cart.getCartByUserId(req.user.id);

    console.log(cart);
    
    // Remove item from cart
    await cart.removeItem(productId);
    
    res.status(200).json({
      success: true,
      data: cart,
      total: cart.calculateTotal()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    // Check if quantity is valid
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    // Get user cart
    const cart = await Cart.getCartByUserId(req.user.id);
    
    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    // Check if product has enough stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart,
      total: cart.calculateTotal()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    // Get user cart
    const cart = await Cart.getCartByUserId(req.user.id);
    
    // Clear cart
    await cart.clearCart();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export { getCart, addToCart, removeFromCart, updateCartItem, clearCart };