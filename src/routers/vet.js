/* eslint-disable new-cap */
const express = require('express');

const HttpError = require('../models/Http-error');
const filesController = require('../controllers/files-controller');
const Vet = require('../models/Vet');

const router = express.Router();

const signupVet = async (req, res, next) => {
  const {name,
    address,
    lat,
    lng} = req.body;

  const createdVet = new Vet({
    name,
    img: req.fileNewName,
    address,
    lat,
    lng,
  });

  try {
    await createdVet.save();
    res.status(201).send(createdVet);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

router.post('/vet/signup',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    signupVet);

module.exports = router;


