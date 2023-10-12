const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');

const routeSignup = require('./routes/signup');
const routeSignin = require('./routes/signin');

const UsersRoute = require('./routes/user');
const CardsRoute = require('./routes/card');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6515c29c125999429b620843',
  };

  next();
});

app.post('/', routeSignup);
app.post('/', routeSignin);
app.use(auth);

app.use('/users', UsersRoute);
app.use('/cards', CardsRoute);

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

app.use(errors());

app.use((err, _, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    const { statusCode = 400 } = err;

    return res.status(statusCode).send({ message: 'Переданы некорректные данные' });
  }

  if (err.name === 'Error') return res.status(err.statusCode).send({ message: err.message });

  if (err.code === 11000) {
    const { statusCode = 409 } = err;

    return res.status(statusCode).send({ message: 'Пользователь с таким электронным адресом уже зарегистрирован' });
  }

  const { statusCode = 500 } = err;
  return next(res.status(statusCode).send({ message: 'На сервере произошла ошибка' }));
});

app.listen(PORT);
