const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFound = require('./errors/notFound');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT, MONGO_URL, INTERNAL_SERVER_STATUS } = require('./config/config');

const { userRouter, cardRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL);

app.post('/signin', login);
app.post('/signup', createUser);

// app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

app.use(errors());

app.use((err, req, res, next) => { // централизованный обработчик
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
  res
    .status(statusCode)
    // проверяем статус и выставляем сообщение в зависимости от него
    .send({
      message: statusCode === INTERNAL_SERVER_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT);
