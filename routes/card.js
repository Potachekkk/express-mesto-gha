const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCard);
router.delete('/:cardId/likes', dislikeCard);

router.put('/:cardId/likes', likeCard);

module.exports = router;
