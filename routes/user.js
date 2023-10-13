const userRouter = require('express').Router();
const { validateGetUserById, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', currentUser);
userRouter.get('/users/:userId', validateGetUserById, getUserById);

userRouter.patch('/users/me', validateUpdateUser, updateUser);
userRouter.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;
