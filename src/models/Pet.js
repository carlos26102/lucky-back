const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const petSchema = new Schema({
  // eslint-disable-next-line max-len
  statePet: {type: String, enum: ['Aceptado', 'En proceso', 'Rechazado', 'Disponible']},
  name: {type: String},
  city: {type: String},
  specie: {type: String},
  dateBirth: {type: Date, default: new Date()},
  gender: {type: String},
  size: {type: String},
  weight: {type: Number},
  personality: {type: String},
  history: {type: String},
  vaccinated: {type: Boolean},
  dewormed: {type: Boolean},
  healthy: {type: Boolean},
  sterilized: {type: Boolean},
  identified: {type: Boolean},
  microchip: {type: Boolean},
  observations: {type: String},
  requirements: {type: String},
  rate: {type: Number},
  shipping: {type: Boolean},
  img: {type: String},
  ownerShelter: {type: mongoose.Types.ObjectId, ref: 'Shelter'},
  ownerUser: {type: mongoose.Types.ObjectId, ref: 'User'},
  ownerAdoption: {type: mongoose.Types.ObjectId, ref: 'Adoption'},
  petAdoptionUser: {type: mongoose.Types.ObjectId, ref: 'Pet'},
});

module.exports = mongoose.model('Pet', petSchema);
