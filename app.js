const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/user'));

app.listen(PORT, (err) => {
  err ? console.log(`В процессе соединения с портом возникла ошибка: ${err}`) : console.log(`Соединение с портом № ${PORT} успешно установлено`);
});
