const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../models/Http-error');
const secret = require('../config/config.json').secret;

const authUser = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const data = jwt.verify(token, secret);
  if (!token) {
    const error = new HttpError(
        'Invalid or missing token.',
        404);
    return next(error);
  }
  try {
    const user = await User.findOne({'_id': data._id, 'tokens.token': token});
    if (!user) {
      const error = new HttpError(
          'User not found.',
          404);
      return next(error);
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    const errr = new HttpError(
        'Not authorized to access this resource.',
        401);
    return next(errr);
  }
};
module.exports = authUser;
