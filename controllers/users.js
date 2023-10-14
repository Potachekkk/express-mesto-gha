const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');
const {
  OK_STATUS,
  OK_CREATED_STATUS,
  SALT_ROUND,
  SECRET_KEY,
} = require('../config/config');

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (user) return res.status(OK_STATUS).send({ user });
      throw new NotFound('Данные по указанному id не найдены');
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные о пользователе'));
      }
      return next(e);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(OK_CREATED_STATUS).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      } else if (e instanceof mongoose.Error.ValidationError) {
        const message = Object.values(e.errors);
        next(new BadRequest(message));
      } else {
        next(e);
      }
    });
};

const updateUser = (req, res, next, newData) => {
  User.findByIdAndUpdate(
    req.user._id,
    newData,
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    throw new NotFound('Пользователь с таким id не найден');
  })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.status(OK_STATUS).send({ token });
    })
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch(next);
};
