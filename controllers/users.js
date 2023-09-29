const User = require('../models/user');
const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../errors/errors')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.send({ data: user })
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => (
      err.name === 'InError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Передан некорректный id' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => (
      err.name === 'InError'
        ? res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' })
    ));
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user._id;
  User.findByIdAndUpdate(
    _id,
    {
      name, about,
    },
    {
      new: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      if (err.name === 'InError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user._id;
  User.findByIdAndUpdate(
    _id,
    {
      avatar,
    },
    {
      new: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      if (err.name === 'InError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
