const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

/* POST create product */
router.post('/', verifyTokenAndAdmin, productController.createProduct);

/* PUT update product data */
router.put('/:id', verifyTokenAndAdmin, productController.updateProduct);

/* DELETE delete product data */
router.delete('/:id', verifyTokenAndAdmin, productController.deleteProduct);

/* GET product data */
router.get('/find/:id', productController.productDetails);

/* GET all products */
router.get('/', productController.allProduct);

module.exports = router;
