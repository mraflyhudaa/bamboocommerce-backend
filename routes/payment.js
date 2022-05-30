const express = require('express');
const router = express.Router();
const midtransController = require('../controller/midtransController');

/* POST transaction token  */
router.post('/', midtransController.transactionToken);

module.exports = router;
