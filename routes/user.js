var express = require('express');
const User = require('../models/User');
var router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* PUT update user data */
router.put('/:id', verifyTokenAndAuthorization, async (req, res, next) => {
  if (req.body.password) {
    bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
      if (err) {
        return res.status(501).json({ message: 'could not hash the password' });
      } else if (passwordHash) {
        req.body.password = passwordHash;
      }
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ message: 'User data updated!', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user data!', error });
  }
});

/* DELETE delete user data */
router.delete('/:id', verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id, (error, deletedUser) => {
      if (error) {
        res.status(401).json(error);
      } else {
        res
          .status(200)
          .json({ message: 'User has been deleted', data: deletedUser });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
});

/* GET user data */
router.get('/find/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await User.findById(req.params.id, (error, user) => {
      if (error) {
        res.status(401).json(error);
      } else {
        const { password, ...others } = user._doc;
        res.status(200).json({ message: 'User found!', data: others });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to find user', error });
  }
});

module.exports = router;
