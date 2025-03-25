// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  imageUrl: {
    type: String
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,  // SQL user ID as string
    required: true,
    index: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d'  // Cart expires after 30 days of inactivity
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total price of all items in cart
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get cart by user ID
cartSchema.statics.getCartByUserId = async function(userId) {
  let cart = await this.findOne({ userId });
  
  if (!cart) {
    // Create new cart if not exists
    cart = await this.create({
      userId,
      items: []
    });
  }
  
  return cart;
};

// Method to add item to cart
cartSchema.methods.addItem = async function(item) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex(i => 
    i.productId.toString() === item.productId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    this.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    this.items.push(item);
  }
  
  this.updatedAt = Date.now();
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  this.updatedAt = Date.now();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  this.updatedAt = Date.now();
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;