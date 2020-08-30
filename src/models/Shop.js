const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  // eslint-disable-next-line max-len
  name: {type: String},
  img: {type: String},
  address: {type: String},
  lat: {type: Number},
  lng: {type: Number},

});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
