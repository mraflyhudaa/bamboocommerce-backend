const express = require('express');
const orderController = require('../controller/orderController');
const router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require('./verifyToken');

/* POST create order */
router.post('/', verifyToken, orderController.createOrder);

/* PUT update order data */
router.put('/:id', verifyTokenAndAdmin, orderController.updateOrder);

/* DELETE delete order */
router.delete('/:id', verifyTokenAndAdmin, orderController.deleteOrder);

/* GET user orders */
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  orderController.findUserOrder
);

/* GET all orders  */
router.get('/', verifyTokenAndAdmin, orderController.findAllOrders);

/* GET monthly income */
router.get('/income', verifyTokenAndAdmin, orderController.monthlyIncome);

/* GET one order */
router.get(
  '/findOrder/:id',
  verifyTokenAndAuthorization,
  orderController.findOrder
);

module.exports = router;
