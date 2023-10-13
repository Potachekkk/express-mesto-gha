const cardRouter = require('express').Router();
const { validateCreateCard, validateUpdateCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validateCreateCard, createCard);
cardRouter.delete('/cards/:cardId', validateUpdateCard, deleteCard);
cardRouter.put('/cards/:cardId/likes', validateUpdateCard, likeCard);
cardRouter.delete('/cards/:cardId/likes', validateUpdateCard, dislikeCard);

module.exports = cardRouter;
