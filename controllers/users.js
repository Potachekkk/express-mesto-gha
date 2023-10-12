const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан некорректный id' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные о пользователе' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10);
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(SUCCESSFULY_CREATED).send({ data: user }))
    .catch((err) => (
      err.name === 'ValidationError'
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
      } else if (err.name === 'ValidationError') {
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const secretKey = '1d0fd800742097b7b0c31828eeda8419aae09a543f9ef131f5e96acf4e536524';

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, secretKey, { expiresIn: '7d' });
      // вернём токен
      res.status(201).send({ _id: token });
    })
    .catch(() => res.status(401).send({ message: 'Неправильные почта или пароль' }));
};

module.exports.currentUser = (req, res) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(OK_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан некорректный id' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некоaрректные данные о пользователе' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
