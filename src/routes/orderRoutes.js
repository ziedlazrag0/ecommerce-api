const express = require('express')
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController')

const { protect, authorize } = require('../middlewares/authMiddleware')

// user
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)

// admin
router.get('/', protect, authorize('admin'), getAllOrders)
router.put('/:id', protect, authorize('admin'), updateOrderStatus)

module.exports = router