const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя карточки должно быть длиной от 2 до 30 символов',
      },
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
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
