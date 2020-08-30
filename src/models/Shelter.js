const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/config.json').secret;

const HttpError = require('../models/Http-error');

const Schema = mongoose.Schema;

const shelterSchema = new Schema({
  name: {type: String, required: true, trim: true},
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
  phone: {type: String, required: true},
  img: {type: String},
  pets: [{type: mongoose.Types.ObjectId, ref: 'Pet'}],
  adoptions: [{type: mongoose.Types.ObjectId, ref: 'Adoption'}],
  tokens: [{token: {type: String, required: true}}],
});

shelterSchema.pre('save', async function(next) {
  // Hash the password before saving the shelter model
  const shelter = this;
  if (shelter.isModified('password')) {
    shelter.password = await bcrypt.hash(shelter.password, 8);
  }
  next();
});

shelterSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the shelter
  const shelter = this;
  const token = jwt.sign({_id: shelter._id}, secret);
  shelter.tokens = shelter.tokens.concat({token});
  await shelter.save();
  return token;
};

shelterSchema.statics.findByCredentials = async (email, password, next) => {
  // Search for a shelter by email and password.
  const shelter = await Shelter.findOne({email} );
  if (!shelter) {
    const error = new HttpError(
        'Invalid credentials, could not log you in.',
        403);
    return next(error);
  }
  const isPasswordMatch = await bcrypt.compare(password, shelter.password);
  if (!isPasswordMatch) {
    const error = new HttpError(
        'Invalid credentials, could not log you in.',
        403);
    return next(error);
  }
  return shelter;
};

const Shelter = mongoose.model('Shelter', shelterSchema);

module.exports = Shelter;

