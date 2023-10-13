const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFound = require('./errors/notFound');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT, MONGO_URL, INTERNAL_SERVER_STATUS } = require('./config/config');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');

const { userRouter, cardRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT);
