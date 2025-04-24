const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get current user profile
router.get('/me', authenticate, authController.getCurrentUser);

// Create staff user (admin only)
router.post('/staff', authenticate, isAdmin, authController.createStaffUser);

module.exports = router;
