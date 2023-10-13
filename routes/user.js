const userRouter = require('express').Router();
const { validateGetUserById, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('me', currentUser);
userRouter.get('/:userId', validateGetUserById, getUserById);

userRouter.patch('/me', validateUpdateUser, updateUser);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;
