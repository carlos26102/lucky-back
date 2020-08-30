/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');

const HttpError = require('../models/Http-error');
const filesController = require('../controllers/files-controller');
const Shop = require('../models/Shop');

const router = express.Router();

const signupShop = async (req, res, next) => {
  const {name,
    lat,
    lng,
    address} = req.body;

  const createdShop = new Shop({
    name,
    address,
    lat,
    lng,
    img: req.fileNewName,
  });

  try {
    await createdShop.save();
    res.status(201).send(createdShop);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

router.post('/shop/signup',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    signupShop);

module.exports = router;


