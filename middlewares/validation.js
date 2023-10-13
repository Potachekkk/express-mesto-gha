const { celebrate, Joi } = require('celebrate');
const { REG_URL, REG_ID } = require('../config/config');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REG_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(REG_ID),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(REG_URL),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(REG_URL),
  }),
});

const validateUpdateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(REG_ID),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validateGetUserById,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCreateCard,
  validateUpdateCard,
};
