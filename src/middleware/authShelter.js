const jwt = require('jsonwebtoken');
const Shelter = require('../models/Shelter');
const HttpError = require('../models/Http-error');
const secret = require('../config/config.json').secret;

const authShelter = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const data = jwt.verify(token, secret);
  if (!token) {
    const error = new HttpError(
        'Invalid or missing token.',
        404);
    return next(error);
  }
  try {
    const shelter = await Shelter.findOne({'_id': data._id,
      'tokens.token': token});
    if (!shelter) {
      const error = new HttpError(
          'Shelter not found.',
          404);
      return next(error);
    }
    req.shelter = shelter;
    req.token = token;
    next();
  } catch (error) {
    const errr = new HttpError(
        'Not authorized to access this resource.',
        401);
    return next(errr);
  }
};
module.exports = authShelter;
