const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { handleError } = require('./middlewares/error-handling');
const { routes } = require('./routes');
const { PORT, MONGO_URL } = require('./config/config');

const app = express();

app.use(express.json());

app.use(helmet());

app.use(express.json());

mongoose.connect(MONGO_URL);

app.use(routes);

app.use(errors());

app.use(handleError);

app.listen(PORT);
