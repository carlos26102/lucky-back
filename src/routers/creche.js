/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');

const HttpError = require('../models/Http-error');
const filesController = require('../controllers/files-controller');
const Creche = require('../models/Creche');

const router = express.Router();

const signupCreche = async (req, res, next) => {
  const {name,
    address,
    lat,
    lng} = req.body;

  const createdCreche = new Creche({
    name,
    address,
    lat,
    lng,
    img: req.fileNewName,
  });

  try {
    await createdCreche.save();
    res.status(201).send(createdCreche);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

router.post('/creche/signup',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    signupCreche);

module.exports = router;


