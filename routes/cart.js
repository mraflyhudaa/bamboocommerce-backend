const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require('./verifyToken');

/* POST create cart */
router.post('/', verifyToken, cartController.addCart);

/* PUT update cart data */
router.put('/:id', verifyTokenAndAuthorization, cartController.updateCart);

/* DELETE delete cart */
router.delete('/:id', verifyTokenAndAuthorization, cartController.deleteCart);

/* GET user cart */
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  cartController.findUserCart
);

/* GET all cart  */
router.get('/', verifyTokenAndAdmin, cartController.findAllCart);

module.exports = router;
