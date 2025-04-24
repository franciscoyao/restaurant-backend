const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { orderSchema, updateOrderStatusSchema } = require('../validators/orderValidator');

// Public routes
router.post('/', validate(orderSchema), orderController.createOrder);
router.get('/customer/:phone', orderController.getOrdersByCustomer);

// Protected routes (staff/admin)
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.patch('/:id/status', authenticate, validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;
