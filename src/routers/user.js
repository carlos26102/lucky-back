const express = require('express');

const filesController = require('../controllers/files-controller');
const HttpError = require('../models/Http-error');
const User = require('../models/User');
const authUser = require('../middleware/authUser');

// eslint-disable-next-line new-cap
const router = express.Router();

const signupUser = async (req, res, next) => {
  const {fullname,
    email,
    password,
    address,
    postalCode,
    city,
    dni,
    phone} = req.body;

  const createdUser = new User({
    fullname,
    email,
    password,
    address,
    postalCode,
    city,
    dni,
    phone,
    img: req.fileNewName,
    pets: [],
    adoptions: [],
  });

  try {
    await createdUser.save();
    const token = await createdUser.generateAuthToken();
    res.status(201).send({createdUser, token});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      const error = new HttpError(
          'Invalid credentials, could not log you in.',
          403);
      return next(error);
    }
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Could not log you in, please check your credentials and try again.',
        400);
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  const {fullname, address, postalCode, city, phone} = req.body;

  const user = req.user;

  user.fullname = fullname;
  user.address = address;
  user.postalCode = postalCode;
  user.city = city;
  user.phone = phone;

  try {
    await user.save();
    res.status(200).send({user});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not update user.',
        500);
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not find user.',
        404);
    return next(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const logoutAllUser = async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

router.post('/user/signup',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    signupUser);

router.post('/user/login',
    loginUser);

router.put('/user/profile',
    filesController.uploadFile('img'),
    authUser,
    updateUser);

router.get('/user/profile',
    authUser,
    getUser);

router.post('/user/logout',
    authUser,
    logoutUser);

router.post('/user/logoutall',
    authUser,
    logoutAllUser);

module.exports = router;
