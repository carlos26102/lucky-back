const express = require('express');

const filesController = require('../controllers/files-controller');
const HttpError = require('../models/Http-error');
const PetUser = require('../models/Pet');
const authUser = require('../middleware/authUser');

// eslint-disable-next-line new-cap
const router = express.Router();

const signupPetUser = async (req, res, next) => {
  const {
    name,
    specie,
    dateBirth,
    gender,
    size,
    weight,
    observations,
  } = req.body;

  const user = req.user;

  const createdPet = new PetUser({
    name,
    specie,
    dateBirth,
    gender,
    size,
    weight,
    observations,
    img: req.fileNewName,
    ownerUser: user,
  });

  try {
    await createdPet.save();
    user.pets.push(createdPet);
    await user.save();
    res.status(201).send({createdPet});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

const listPetsUser = async (req, res, next) => {
  const userWithPets = await req.user.populate('pets').execPopulate();

  if (userWithPets.pets.length === 0) {
    return next(
        new HttpError('Could not find pets for the provided user id.',
            404),
    );
  }
  res.json({
    pets: userWithPets.pets.map((pet) =>
      pet.toObject({getters: true}),
    ),
  });
};

const getPetUser = async (req, res, next) => {
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetUser.findById(petId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find a pet.',
        500);
    return next(error);
  }

  if (!pet) {
    const error = new HttpError(
        'Could not find pet for the provided id.',
        404);
    return next(error);
  }

  res.json({pet: pet.toObject({getters: true})});
};

const updatePetUser = async (req, res, next) => {
  const {weight} = req.body;
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetUser.findById(petId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update pet.',
        500);
    return next(error);
  }

  pet.weight = weight;

  try {
    await pet.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update pet.',
        500);
    return next(error);
  }

  res.status(200).json({pet: pet.toObject({getters: true})});
};

const deletePetUser = async (req, res, next) => {
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetUser.findById(petId).populate('ownerUser');
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not delete pet.',
        500);
    return next(error);
  }

  if (!pet) {
    const error = new HttpError('Could not find pet for this id.',
        404);
    return next(error);
  }

  try {
    await pet.remove();
    pet.ownerUser.pets.pull(pet);
    await pet.ownerUser.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not delete pet.',
        500);
    return next(error);
  }

  res.status(200).json({message: 'Deleted pet.'});
};

router.post('/user/pets',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    authUser,
    signupPetUser);

router.get('/user/pets',
    authUser,
    listPetsUser);

router.get('/user/pets/:pid',
    authUser,
    getPetUser);

router.put('/user/pets/:pid',
    filesController.uploadFile('img'),
    authUser,
    updatePetUser);

router.delete('/user/pets/:pid',
    authUser,
    deletePetUser);

module.exports = router;
