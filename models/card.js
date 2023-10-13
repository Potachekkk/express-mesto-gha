const mongoose = require('mongoose');
const { REG_URL } = require('../config/config');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Название не может быть короче 2 символов'],
      maxlength: [30, 'Название не может быть длиннее 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator(url) {
          return REG_URL.test(url);
        },
        message: 'Неверно указан URL изображения',
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: [true, 'Поле "owner" должно быть заполнено'],
    },
    likes: [{
      type: ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
