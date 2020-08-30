const express = require('express');

const HttpError = require('../models/Http-error');
const Adoption = require('../models/Adoption');
const User = require('../models/User');
const PetShelter = require('../models/Pet');
const authUser = require('../middleware/authUser');

// eslint-disable-next-line new-cap
const router = express.Router();

const updatePetAdoption = async function(adoptionPetUser, req, res, next) {
  const statePet = 'En proceso';

  let pet;
  try {
    pet = await PetShelter.findById(adoptionPetUser);
  } catch (error) {
    const err = new HttpError(
        'Something went wrong, could not find pet.',
        500);
    return next(err);
  }

  pet.statePet = statePet;

  try {
    await pet.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update pet.',
        500);
    return next(error);
  }
};

const signupAdoptionUser = async (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    dni,
    address,
    postalCode,
    city,
    acceptTerms,
    haveOtherAnimals,
    whichOtherAnimals,
    wellWithOtherAnimals,
    whyChosenAdopt,
    knowNeedsAnimal,
    knowHisExpenses,
    knowHisDiet,
    typeHouse,
    liveRenting,
    homeAllowsAnimals,
    moveSoon,
    hasGarden,
    liveOtherPeople,
    peopleAgreeAdoption,
    agreeVisitHome,
    adoptionPetUser,
  } = req.body;

  const user = req.user;

  const createdAdoption = new Adoption({
    fullName,
    email,
    phone,
    dni,
    address,
    postalCode,
    city,
    acceptTerms,
    haveOtherAnimals,
    whichOtherAnimals,
    wellWithOtherAnimals,
    whyChosenAdopt,
    knowNeedsAnimal,
    knowHisExpenses,
    knowHisDiet,
    typeHouse,
    liveRenting,
    homeAllowsAnimals,
    moveSoon,
    hasGarden,
    liveOtherPeople,
    peopleAgreeAdoption,
    agreeVisitHome,
    adoptionPetUser,
    adoptionUser: user,
  });

  try {
    await updatePetAdoption(adoptionPetUser);
    await createdAdoption.save();
    user.adoptions.push(createdAdoption);
    await user.save();
    res.status(201).send({createdAdoption});
  } catch (error) {
    const err = new HttpError(
        'Creating adoption failed, please try again.',
        500);
    return next(err);
  }
};

const getAdoptionUser = async (req, res, next) => {
  const petId = req.params.pid;

  let pet;
  try {
    pet = await PetShelter.findById(petId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find an adoption.',
        500);
    return next(error);
  }

  if (!pet) {
    const error = new HttpError(
        'Could not find adoption for the provided id.',
        404);
    return next(error);
  }

  res.json({pet: pet.toObject({getters: true})});
};

const listAdoptionsUser = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithAdoptions;
  try {
    // eslint-disable-next-line max-len
    userWithAdoptions = await User.findById(userId).populate({
      path: 'adoptions',
      populate: {path: 'adoptionPetUser'},
    });
  } catch (error) {
    const err = new HttpError(
        'Fetching adoptions failed, please try again later.',
        500);
    return next(err);
  }

  if (!userWithAdoptions || userWithAdoptions.adoptions.length === 0) {
    return next(
        new HttpError('Could not find adoptions for the provided user id.',
            404));
  }

  res.json({
    adoptions: userWithAdoptions.adoptions.map((adoption) =>
      adoption.toObject({getters: true})),
  });
};


router.post('/user/adoptions', authUser, signupAdoptionUser);

router.get('/user/adoption/:pid', authUser, getAdoptionUser);

router.get('/user/adoptions/:uid', authUser, listAdoptionsUser);

module.exports = router;
