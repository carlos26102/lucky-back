const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vetSchema = new Schema({
  // eslint-disable-next-line max-len
  name: {type: String},
  img: {type: String},
  address: {type: String},
  lat: {type: Number},
  lng: {type: Number},

});

const Vet = mongoose.model('Vet', vetSchema);

module.exports = Vet;
