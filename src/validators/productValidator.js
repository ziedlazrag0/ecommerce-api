const Joi = require('joi')

exports.productSchema = Joi.object({
  name: Joi.string().min(3).required(),

  description: Joi.string().min(5).required(),

  price: Joi.number().positive().required(),

  stock: Joi.number().integer().min(0).required(),

  category: Joi.string().required()
})