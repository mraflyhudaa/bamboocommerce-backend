const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require('./verifyToken');

/* POST create order */
router.post('/', verifyToken, async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res
      .status(200)
      .json({ message: 'Product added to your Order!', savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed adding orders', error });
  }
});

/* PUT update order data */
router.put('/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ message: 'Order updated!', data: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update your order!', error });
  }
});

/* DELETE delete order */
router.delete('/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Order has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Order!', error });
  }
});

/* GET user orders */
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).json({ message: 'Your orders found!', data: orders });
    } catch (error) {
      res.status(500).json({ message: 'Your order is empty!', error });
    }
  }
);

/* GET all orders  */
router.get('/', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* GET monthly income */
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
