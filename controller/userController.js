const User = require('../models/User');

/* UPDATE USER */
const updateUser = async (req, res, next) => {
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
};

/* DELETE USER */
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    const { username } = deletedUser._doc;
    res.status(200).json({ message: `User ${username} has been deleted!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user!', error });
  }
};

/* FIND USER DATA */
const findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ message: 'User found!', data: others });
  } catch (error) {
    res.status(500).json({ message: 'User not found!', error });
  }
};

/* FIND ALL USERS (filter by new=true/false) */
const findAllUser = async (req, res, next) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json({ message: 'Users found!', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Users not found!', error });
  }
};

/* GET USER STATS */
const userStats = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { updateUser, deleteUser, findUser, findAllUser, userStats };
