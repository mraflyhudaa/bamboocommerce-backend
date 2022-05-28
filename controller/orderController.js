const Order = require('../models/Order');

/* CREATE ORDER */
const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res
      .status(200)
      .json({ message: 'Product added to your Order!', savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed adding orders', error });
  }
};

/* UPDATE ORDER */
const updateOrder = async (req, res, next) => {
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
};

/* DELETE ORDER */
const deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Order has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Order!', error });
  }
};

/* FIND USER ORDER */
const findUserOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({ message: 'Your orders found!', data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Your order is empty!', error });
  }
};

/* FIND ALL ORDERS */
const findAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* MONTHLY INCOME */
const monthlyIncome = async (req, res) => {
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
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  findUserOrder,
  findAllOrders,
  monthlyIncome,
};
