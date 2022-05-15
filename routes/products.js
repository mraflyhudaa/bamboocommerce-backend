var express = require('express');
const Product = require('../models/Product');
var router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

/* POST create product */
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({ message: 'Product created!', savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
});

/* PUT update product data */
router.put('/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated!', data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product!', error });
  }
});

/* DELETE delete product data */
router.delete('/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    const { title } = deletedProduct._doc;
    res.status(200).json({ message: `Product ${title} has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Product!', error });
  }
});

/* GET product data */
router.get('/find/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ message: 'Product found!', data: product });
  } catch (error) {
    res.status(500).json({ message: 'Product not found!', error });
  }
});

/* GET all products */
router.get('/', verifyTokenAndAdmin, async (req, res, next) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json({ message: 'Products found!', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Products not found!', error });
  }
});

module.exports = router;
