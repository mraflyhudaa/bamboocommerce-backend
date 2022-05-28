const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* REGISTER */
const register = async (req, res, next) => {
  await User.findOne({
    username: req.body.username,
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        return res
          .status(401)
          .json({ message: 'username or email already exists' });
      } else if (req.body.username && req.body.email && req.body.password) {
        bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
          if (err) {
            return res
              .status(501)
              .json({ message: 'could not hash the password' });
          } else if (passwordHash) {
            return new User({
              username: req.body.username,
              email: req.body.email,
              password: passwordHash,
            })
              .save()
              .then(() => {
                res.status(201).json({ message: 'User created' });
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ message: 'error while creating the user', err });
              });
          }
        });
      } else if (!req.body.password) {
        return res.status(401).json({ message: 'password not provided' });
      } else if (!req.body.email) {
        return res.status(401).json({ message: 'email not provided' });
      } else if (!req.body.username) {
        return res.status(401).json({ message: 'username not provided' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

/* LOGIN */
const login = async (req, res, next) => {
  await User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json('User not found');
      } else {
        bcrypt.compare(req.body.password, user.password, (err, compareRes) => {
          if (err) {
            res
              .status(501)
              .json({ message: 'error while checking user password' });
          } else if (compareRes) {
            const token = jwt.sign(
              {
                id: user._id,
                isAdmin: user.isAdmin,
              },
              process.env.JWT_SECRET,
              { expiresIn: '3d' }
            );
            const { password, ...others } = user._doc;
            res
              .status(201)
              .json({ message: 'user logged in', data: { ...others, token } });
          } else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
        });
      }
    })
    .catch((err) => {
      res.status(501).json(err);
    });
};

module.exports = { register, login };
