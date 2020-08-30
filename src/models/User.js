const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/config.json').secret;

const HttpError = require('../models/Http-error');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({error: 'Invalid Email address'});
      }
    }},
  password: {type: String, required: true, minlength: 8},
  address: {type: String, required: true},
  location: {
    lat: {type: Number},
    lng: {type: Number},
  },
  postalCode: {type: String, required: true},
  city: {type: String, required: true},
  dni: {type: String, required: true},
  phone: {type: String, required: true},
  img: {type: String},
  pets: [{type: mongoose.Types.ObjectId, ref: 'Pet'}],
  adoptions: [{type: mongoose.Types.ObjectId, ref: 'Adoption'}],
  tokens: [{token: {type: String, required: true}}],
});

userSchema.pre('save', async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({_id: user._id}, secret);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password, next) => {
  // Search for a user by email and password.
  const user = await User.findOne({email} );
  if (!user) {
    const error = new HttpError(
        'Invalid credentials, could not log you in.',
        403);
    return next(error);
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new HttpError(
        'Invalid credentials, could not log you in.',
        403);
    return next(error);
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
