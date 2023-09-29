const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UsersRoute = require('./routes/user');
const CardsRoute = require('./routes/card');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6515c29c125999429b620843',
  };

  next();
});

app.use('/users', UsersRoute);
app.use('/cards', CardsRoute);

app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' }));
});

app.listen(PORT);
