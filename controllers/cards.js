const Card = require('../models/card');

const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/notOwner');

module.exports.getCards = (_, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card
    .create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;
  Card
    .findById({
      _id: cardId,
    })
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');
      card
        .remove()
        .then(() => res.status(200).send({ data: card }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.status(200).send({ data: card });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.status(200).send({ data: card });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};
