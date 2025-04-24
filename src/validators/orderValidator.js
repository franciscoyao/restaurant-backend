const Joi = require('joi');

const orderItemSchema = Joi.object({
  menu_item_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  notes: Joi.string().allow('', null)
});

const orderSchema = Joi.object({
  customer_name: Joi.string().required().min(2).max(100),
  customer_email: Joi.string().email().allow('', null),
  customer_phone: Joi.string().required().pattern(/^\+?[0-9\s\-\(\)]{8,20}$/),
  pickup_time: Joi.date().iso().required().min('now'),
  notes: Joi.string().allow('', null),
  items: Joi.array().items(orderItemSchema).min(1).required()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'preparing', 'ready', 'completed', 'cancelled').required()
});

module.exports = { orderSchema, updateOrderStatusSchema };
