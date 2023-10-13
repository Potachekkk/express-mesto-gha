const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/authError');
const { SECRET_KEY } = require('../config/config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthErr('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return next(new AuthErr('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
