// const express = require('express');
// const router = express.Router();
// const { register, login, getMe, logout } = require('../controllers/AuthController');
// const { protect } = require('../middleware/auth');
import express from 'express';
import { register, login, getMe, logout } from '../controllers/AuthController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;