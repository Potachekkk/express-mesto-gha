const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const secretKey = '1d0fd800742097b7b0c31828eeda8419aae09a543f9ef131f5e96acf4e536524';

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
};
