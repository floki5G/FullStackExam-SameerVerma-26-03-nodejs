// const express = require('express');
// const router = express.Router();
// const {
//   getCart,
//   addToCart,
//   removeFromCart,
//   updateCartItem,
//   clearCart
// } = require('../controllers/CartController');
// const { protect } = require('../middleware/auth');
import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/CartController.js';
import { protect } from '../middleware/auth.js';
// Initialize express router
const router = express.Router();
// All cart routes are protected
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;