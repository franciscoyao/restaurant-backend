const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { menuItemSchema } = require('../validators/menuValidator');

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.get('/category/:category', menuController.getMenuItemsByCategory);
router.get('/:id', menuController.getMenuItem);

// Protected routes (admin only)
router.post('/', authenticate, isAdmin, validate(menuItemSchema), menuController.createMenuItem);
router.put('/:id', authenticate, isAdmin, validate(menuItemSchema), menuController.updateMenuItem);
router.delete('/:id', authenticate, isAdmin, menuController.deleteMenuItem);

module.exports = router;
