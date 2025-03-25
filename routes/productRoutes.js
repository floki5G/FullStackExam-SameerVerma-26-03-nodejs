// const express = require('express');
// const router = express.Router();
// const {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   searchProducts
// } = require('../controllers/ProductController');
// const { protect, admin } = require('../middleware/auth');
import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts } from '../controllers/ProductController.js';
import { protect, admin } from '../middleware/auth.js';
// Initialize express router
const router = express.Router();
// Public routes
// // Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;