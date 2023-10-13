const express = require('express');
const { userRouter } = require('./user');
const { cardRouter } = require('./card');
const { auth } = require('../middlewares/auth');
const { NotFound } = require('../errors/notFound');
const { createUser, login } = require('../controllers/users');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');

const routes = express.Router();

routes.post('./signin', validateLogin, login);
routes.post('./signup', validateCreateUser, createUser);

routes.use('/users', auth, userRouter);
routes.use('/cards', auth, cardRouter);

routes.all('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = { routes };
