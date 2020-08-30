const express = require('express');

const filesController = require('../controllers/files-controller');
const HttpError = require('../models/Http-error');
const PetShelter = require('../models/Pet');
const Shelter = require('../models/Shelter');
const authShelter = require('../middleware/authShelter');
// const authUser = require('../middleware/authUser');

// eslint-disable-next-line new-cap
const router = express.Router();

const signupPetShelter = async (req, res, next) => {
  const {
    statePet,
    name,
    city,
    specie,
    dateBirth,
    gender,
    size,
    weight,
    personality,
    history,
    vaccinated,
    dewormed,
    healthy,
    sterilized,
    identified,
    microchip,
    observations,
    requirements,
    rate,
    shipping,
  } = req.body;

  const shelter = req.shelter;

  const createdPet = new PetShelter({
    statePet,
    name,
    city,
    specie,
    dateBirth,
    gender,
    size,
    weight,
    personality,
    history,
    vaccinated,
    dewormed,
    healthy,
    sterilized,
    identified,
    microchip,
    observations,
    requirements,
    rate,
    shipping,
    img: req.fileNewName,
    ownerShelter: shelter,
    // ownerAdoption,
  });

  try {
    await createdPet.save();
    shelter.pets.push(createdPet);
    await shelter.save();
    res.status(201).send({createdPet});
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Signing up failed, please try again.',
        400);
    return next(err);
  }
};

const listPetsShelter = async (req, res, next) => {
  const shelterId = req.params.sid;

  let shelterWithPets;
  try {
    shelterWithPets = await Shelter.findById(shelterId).populate('pets');
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Fetching pets failed, please try again later.',
        500);
    return next(err);
  }

  if (!shelterWithPets || shelterWithPets.pets.length === 0) {
    return next(
        new HttpError('Could not find pets for the provided user id.',
            404));
  }

  res.json({
    pets: shelterWithPets.pets.map((pet) =>
      pet.toObject({getters: true})),
  });
};

const getPetShelter = async (req, res, next) => {
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetShelter.findById(petId);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not find a pet.',
        500);
    return next(err);
  }

  if (!pet) {
    const err = new HttpError(
        'Could not find pet for the provided id.',
        404);
    return next(err);
  }

  res.json({pet: pet.toObject({getters: true})});
};

const updatePetShelter = async (req, res, next) => {
  const {statePet} = req.body;

  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetShelter.findById(petId);
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not update pet.',
        500);
    return next(err);
  }

  pet.statePet = statePet;

  try {
    await pet.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not update pet.',
        500);
    return next(err);
  }

  res.status(200).json({pet: pet.toObject({getters: true})});
};

const deletePetShelter = async (req, res, next) => {
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetShelter.findById(petId).populate('ownerShelter');
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not delete pet.',
        500);
    return next(err);
  }

  if (!pet) {
    const err = new HttpError(
        'Could not find pet for this id.',
        404);
    return next(err);
  }

  try {
    await pet.remove();
    pet.ownerShelter.pets.pull(pet);
    await pet.ownerShelter.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError(
        'Something went wrong, could not delete pet.',
        500);
    return next(err);
  }

  res.status(200).json({message: 'Deleted pet.'});
};

router.post('/shelter/pets',
    filesController.uploadFile('img'),
    filesController.uploadToCloudinary,
    authShelter,
    signupPetShelter);

router.get('/shelter/pets/:sid',
    listPetsShelter);

router.get('/shelter/pet/:pid',
    getPetShelter);

router.put('/shelter/pets/:pid',
    filesController.uploadFile('img'),
    authShelter,
    updatePetShelter);

router.delete('/shelter/pets/:pid',
    authShelter,
    deletePetShelter);

module.exports = router;

