const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedErr = require('../errors/unAutorize');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const token = authorization.replace(bearer, '');

  if (!token) {
    return next(new UnauthorizedErr('Отсутствует jwt токен'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedErr('Необходимо авторизироваться'));
  }

  req.user = payload;

  return next();
};
