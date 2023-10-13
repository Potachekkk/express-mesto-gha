const userRouter = require('express').Router();
const { validateGetUserById, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  currentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('me', currentUser);
userRouter.get('/:userId', validateGetUserById, getUserById);

userRouter.patch('/me', validateUpdateUser, updateUserInfo);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = { userRouter };
