const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id
  })

  res.status(201).json(product)
})

exports.getAllProducts = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const search = req.query.search || ''
  const category = req.query.category || ''
  const sort = req.query.sort || ''

  const query = {}

  // 🔍 Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }

  // 📂 Filter by category
  if (category) {
    query.category = category
  }

  const total = await Product.countDocuments(query)

  let productsQuery = Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit)

  // 🔃 Sorting
  if (sort) {
    productsQuery = productsQuery.sort(sort)
  }

  const products = await productsQuery

  res.json({
    products,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total
  })
  
})

exports.getProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)
    if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
  })

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
})


exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(
    req.params.id,
  )

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
})