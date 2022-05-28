const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

/* PUT update user data */
router.put('/:id', verifyTokenAndAuthorization, userController.updateUser);

/* DELETE delete user data */
router.delete('/:id', verifyTokenAndAuthorization, userController.deleteUser);

/* GET user data */
router.get('/find/:id', verifyTokenAndAdmin, userController.findUser);

/* GET all user data */
router.get('/', verifyTokenAndAdmin, userController.findAllUser);

/* GET user stats */
router.get('/stats', verifyTokenAndAdmin, userController.userStats);

module.exports = router;
