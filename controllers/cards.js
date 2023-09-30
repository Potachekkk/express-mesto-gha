const Card = require('../models/card');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  SUCCESSFULY_CREATED,
  OK_SUCCESS,
} = require('../responds/status');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка ' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(SUCCESSFULY_CREATED).send({ data: card }))
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании карточки' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(OK_SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, upsert: false },
  )
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(OK_SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, upsert: false },
  )
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(OK_SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
