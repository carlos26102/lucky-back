const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CrecheSchema = new Schema({
  // eslint-disable-next-line max-len
  name: {type: String},
  img: {type: String},
  address: {type: String},
  lat: {type: Number},
  lng: {type: Number},

});

const Creche = mongoose.model('Creche', CrecheSchema);

module.exports = Creche;
