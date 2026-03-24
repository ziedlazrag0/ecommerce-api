const express = require('express')
const validate = require('../middlewares/validate')
const { productSchema } = require('../validators/productValidator')

const router = express.Router()
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const { protect, authorize } = require('../middlewares/authMiddleware')

// Protected routes (only logged-in users can create/update/delete)
router.post('/', protect, authorize('admin'), validate(productSchema), createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.put('/:id', protect, authorize('admin'), validate(productSchema), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)

module.exports = router