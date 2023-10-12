const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  User
    .findById(id)
    .then((user) => {
      if (user) return res.status(200).send({ user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
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
    .then((user) => {
      if (user) return res.status(200).send({ user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
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
    .then((user) => {
      if (user) return res.status(200).send({ user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const secretKey = '1d0fd800742097b7b0c31828eeda8419aae09a543f9ef131f5e96acf4e536524';

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign(
          { userId },
          secretKey,
          { expiresIn: '7d' },
        );
        return res.status(200).send({ _id: token });
      }
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user) return res.status(200).send({ user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};
