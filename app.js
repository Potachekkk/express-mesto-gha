const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const UsersRoute = require('./routes/user');
const CardsRoute = require('./routes/card');
const createUser = require('./controllers/users');
const login = require('./controllers/users');
const { ERROR_NOT_FOUND } = require('./responds/status');

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

app.use('/users', UsersRoute);
app.use('/cards', CardsRoute);
// app.post('/signin', login);
// app.post('/signup', createUser);

app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' }));
});

app.listen(PORT);
