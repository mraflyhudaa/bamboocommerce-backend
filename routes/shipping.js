const express = require('express');
const router = express.Router();
const rajaOngkirController = require('../controller/shippingController');

/* GET province */
router.get('/:id', rajaOngkirController.getProvince);

/* GET all province */
router.get('/', rajaOngkirController.getAllProvince);

module.exports = router;
