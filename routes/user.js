const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/me', currentUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
