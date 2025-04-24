const Joi = require('joi');

const menuItemSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().required().min(0),
  image_url: Joi.string().uri().allow('', null),
  category: Joi.string().required(),
  available: Joi.boolean().default(true),
  featured: Joi.boolean().default(false)
});

module.exports = { menuItemSchema };
