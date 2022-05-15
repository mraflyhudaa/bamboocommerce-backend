var express = require('express');
const Cart = require('../models/Cart');
var router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require('./verifyToken');

/* POST create cart */
router.post('/', verifyToken, async (req, res, next) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json({ message: 'Product added to your cart!', savedCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed adding product to your cart', error });
  }
});

/* PUT update cart data */
router.put('/:id', verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ message: 'Cart updated!', data: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update your cart!', error });
  }
});

/* DELETE delete cart */
router.delete('/:id', verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Cart has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Product!', error });
  }
});

/* GET user cart */
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json({ message: 'Cart found!', data: cart });
    } catch (error) {
      res.status(500).json({ message: 'Your cart is empty!', error });
    }
  }
);

/* GET all cart  */
router.get('/', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
