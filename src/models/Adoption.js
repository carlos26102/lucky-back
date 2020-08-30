const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adoptionSchema = new Schema({
  fullName: {type: String},
  email: {type: String},
  phone: {type: String},
  dni: {type: String},
  address: {type: String},
  postalCode: {type: String},
  city: {type: String},
  acceptTerms: {type: Boolean},
  haveOtherAnimals: {type: Boolean},
  whichOtherAnimals: {type: String},
  wellWithOtherAnimals: {type: String},
  whyChosenAdopt: {type: String},
  knowNeedsAnimal: {type: String},
  knowHisExpenses: {type: String},
  knowHisDiet: {type: String},
  typeHouse: {type: String},
  liveRenting: {type: Boolean},
  homeAllowsAnimals: {type: Boolean},
  moveSoon: {type: Boolean},
  hasGarden: {type: Boolean},
  liveOtherPeople: {type: Boolean},
  peopleAgreeAdoption: {type: Boolean},
  agreeVisitHome: {type: Boolean},
  adoptionPetUser: {type: mongoose.Types.ObjectId, ref: 'Pet'},
  adoptionUser: {type: mongoose.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Adoption', adoptionSchema);
