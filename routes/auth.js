const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

/* POST register */
router.post('/register', authController.register);

/* POST login */
router.post('/login', authController.login);

/* POST addUser */
router.post('/adduser', authController.addUser);

module.exports = router;
