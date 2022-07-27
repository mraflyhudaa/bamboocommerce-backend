const express = require('express');
const router = express.Router();
const midtransController = require('../controller/paymentController');

/* POST transaction token  */
router.post('/', midtransController.transactionToken);

router.post('/status', midtransController.notificationStatus);

module.exports = router;
