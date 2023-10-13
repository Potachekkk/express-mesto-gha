const cardRouter = require('express').Router();
const { validateCreateCard, validateUpdateCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateUpdateCard, deleteCard);
cardRouter.put('/:cardId/likes', validateUpdateCard, likeCard);
cardRouter.delete('/:cardId/likes', validateUpdateCard, dislikeCard);

module.exports = { cardRouter };
