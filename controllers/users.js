const User = require('../models/user');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  SUCCESSFULY_CREATED,
  OK_SUCCESS,
} = require('../responds/status');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(OK_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESSFULY_CREATED).send({ data: user }))
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      name, about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(OK_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан некорректный id' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении информации о пользователе' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(OK_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан некорректный id' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
