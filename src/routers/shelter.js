const express = require('express');

const HttpError = require('../models/Http-error');
const filesController = require('../controllers/files-controller');
const Shelter = require('../models/Shelter');
const authShelter = require('../middleware/authShelter');

// eslint-disable-next-line new-cap
const router = express.Router();

const signupShelter = async (req, res, next) => {
  const {name,
    email,
    password,
    address,
    phone} = req.body;

  const createdShelter = new Shelter({
    name,
    email,
    password,
    address,
    phone,
    img: req.fileNewName,
    pets: [],
    adoptions: [],
  });

  try {
    await createdShelter.save();
    const token = await createdShelter.generateAuthToken();
    res.status(201).send({createdShelter, token});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

const loginShelter = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const shelter = await Shelter.findByCredentials(email, password);
    if (!shelter) {
      const error = new HttpError(
          'Invalid credentials, could not log you in.',
          403);
      return next(error);
    }
    const token = await shelter.generateAuthToken();
    res.send({shelter, token});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Could not log you in, please check your credentials and try again.',
        400);
    return next(err);
  }
};

const updateShelter = async (req, res, next) => {
  const {name, address, phone} = req.body;

  const shelter = req.shelter;

  shelter.name = name;
  shelter.address = address;
  shelter.phone = phone;

  try {
    await shelter.save();
    res.status(200).send({shelter});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not update user.',
        500);
    return next(err);
  }
};

const getShelter = async (req, res, next) => {
  const shelterId = req.params.sid;

  let shelter;
  try {
    shelter = await Shelter.findById(shelterId);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not find a shelter.',
        500);
    return next(err);
  }

  if (!shelter) {
    const error = new HttpError(
        'Could not find shelter for the provided id.',
        404);
    return next(error);
  }

  res.json({shelter: shelter.toObject({getters: true})});
};

const logoutShelter = async (req, res) => {
  try {
    req.shelter.tokens = req.shelter.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.shelter.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const logoutAllShelter = async (req, res) => {
  try {
    req.shelter.tokens.splice(0, req.shelter.tokens.length);
    await req.shelter.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

router.post('/shelter/signup',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    signupShelter);

router.post('/shelter/login',
    loginShelter);

router.put('/shelter/profile',
    filesController.uploadFile('img'),
    authShelter,
    updateShelter);

router.get('/shelter/profile/:sid',
    getShelter);

router.post('/shelter/logout',
    authShelter,
    logoutShelter);

router.post('/shelter/logoutall',
    authShelter,
    logoutAllShelter);

module.exports = router;

