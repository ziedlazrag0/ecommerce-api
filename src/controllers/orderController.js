const asyncHandler = require('../utils/asyncHandler')
const Order = require('../models/Order')
const Product = require('../models/Product')

exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems} = req.body

  if (!orderItems || orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  }

  let totalPrice = 0

  for (const item of orderItems) {

    const product = await Product.findById(item.product)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    if (product.stock < item.quantity) {
      res.status(400)
      throw new Error(`Not enough stock for ${product.name}`)
    }

    totalPrice += product.price * item.quantity
    product.stock -= item.quantity
    await product.save()
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice
  })

  res.status(201).json(order)
})

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name price')

  res.json(orders)
})

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')

  res.json(orders)
})

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  order.status = req.body.status || order.status

  await order.save()

  res.json(order)
})