const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', currentUser);
userRouter.get('/users/:userId', getUserById);

userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
