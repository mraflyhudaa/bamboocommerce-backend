const Cart = require('../models/Cart');

/* CREATE CART */
const addCart = async (req, res, next) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json({ message: 'Product added to your cart!', savedCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed adding product to your cart', error });
  }
};

/* UPDATE CART */
const updateCart = async (req, res, next) => {
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
};

/* DELETE CART */
const deleteCart = async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Cart has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Product!', error });
  }
};

/* FIND USER CART */
const findUserCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json({ message: 'Cart found!', data: cart });
  } catch (error) {
    res.status(500).json({ message: 'Your cart is empty!', error });
  }
};

/* FIND ALL CART */
const findAllCart = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addCart, updateCart, deleteCart, findUserCart, findAllCart };
