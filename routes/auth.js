const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

/* POST register */
router.post('/register', authController.register);

/* POST login */
router.post('/login', authController.login);

module.exports = router;
