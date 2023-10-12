const { PORT = 3000 } = process.env;

// База данных
const MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb';

// Статусы ошибок
const OK_STATUS = 200;
const OK_CREATED_STATUS = 201;
const BAD_REQUEST_STATUS = 400;
const UNAUTHORIZED_STATUS = 401;
const NOT_OWNER_STATUS = 403;
const NOT_FOUND_STATUS = 404;
const CONFLICT_STATUS = 409;
const INTERNAL_SERVER_STATUS = 500;

// Авторизация
const SALT_ROUND = 10;
const SECRET_KEY = 'some-secret-key';

// Регулярные выражения
const REG_URL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const REG_ID = /^[0-9a-fA-F]{24}$/;

// Девфолтные значения
const DEFAULT_NAME = 'Жак-Ив Кусто';
const DEFAULT_ABOUT = 'Исследователь';
const DEFAULT_AVATAR_URL = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

module.exports = {
  PORT,
  MONGO_URL,
  OK_STATUS,
  OK_CREATED_STATUS,
  BAD_REQUEST_STATUS,
  UNAUTHORIZED_STATUS,
  NOT_OWNER_STATUS,
  NOT_FOUND_STATUS,
  CONFLICT_STATUS,
  INTERNAL_SERVER_STATUS,
  SALT_ROUND,
  SECRET_KEY,
  REG_URL,
  REG_ID,
  DEFAULT_NAME,
  DEFAULT_ABOUT,
  DEFAULT_AVATAR_URL,
};
