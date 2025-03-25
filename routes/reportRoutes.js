// const express = require('express');
// const router = express.Router();
// const {
//   getDailyRevenue,
//   getTopSpenders,
//   getSalesByCategory,
//   getMonthlySales
// } = require('../controllers/ReportController');
// const { protect, admin } = require('../middleware/auth');
import express from 'express';
import { getDailyRevenue, getTopSpenders, getSalesByCategory, getMonthlySales } from '../controllers/ReportController.js';
import { protect, admin } from '../middleware/auth.js';
// Initialize express router
const router = express.Router();
// All report routes are protected and admin only
router.use(protect, admin);

router.get('/daily-revenue', getDailyRevenue);
router.get('/top-spenders', getTopSpenders);
router.get('/sales-by-category', getSalesByCategory);
router.get('/monthly-sales', getMonthlySales);
 export default router;