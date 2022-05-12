var express = require('express');
const User = require('../models/User');
var router = express.Router();

const { verifyTokenAndAuthorization } = require('./verifyToken');

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

router.post('/userposttest', (req, res, next) => {
  const username = req.body.username;
  res.send('Your username is ' + username);
});

module.exports = router;
