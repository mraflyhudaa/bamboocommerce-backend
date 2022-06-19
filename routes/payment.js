const express = require('express');
const router = express.Router();
const midtransController = require('../controller/paymentController');

/* POST transaction token  */
router.post('/', midtransController.transactionToken);

module.exports = router;
