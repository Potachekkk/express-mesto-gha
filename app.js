const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { handleError } = require('./middlewares/error-handling');
// const NotFound = require('./errors/notFound');
const { routes } = require('./routes');
// const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const { PORT, MONGO_URL } = require('./config/config');
// const { validateLogin, validateCreateUser } = require('./middlewares/validation');

// const { userRouter, cardRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use(helmet());

app.use(express.json());

mongoose.connect(MONGO_URL);

// app.post('/signin', validateLogin, login);
// app.post('/signup', validateCreateUser, createUser);

// app.use(auth);

// app.use('/users/', userRouter);
// app.use('/cards', cardRouter);
// app.use('*', (req, res, next) => {
//   next(new NotFound('Такой страницы не существует'));
// });
app.use(routes);

app.use(errors());

app.use(handleError);
// app.use((err, req, res, next) => {
//   const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === INTERNAL_SERVER_STATUS
//         ? 'На сервере произошла ошибка'
//         : message,
//     });

//   next();
// });

app.listen(PORT);
