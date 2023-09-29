const Card = require('../models/card');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка ' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link,
  })
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании карточки' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.likeCard = (req, res) => {
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для добавления лайка' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports.dislikeCard = (req, res) => {
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};