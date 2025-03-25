// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderStatus
// } = require('../controllers/OrderController');
// const { protect, admin } = require('../middleware/auth');
import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/OrderController.js';
import { protect, admin } from '../middleware/auth.js';
// Initialize express router
const router = express.Router();
// All order routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

// Admin only route
router.put('/:id', admin, updateOrderStatus);

export default router;