const axios = require('axios');

const HttpError = require('../models/Http-error');

const API_KEY = 'XXX';

// eslint-disable-next-line require-jsdoc
async function getCoordsForAddress(address) {
  const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=
      ${encodeURIComponent(
      address,
  )}&key=${API_KEY}`,
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
        'Could not find location for the specified address.',
        422,
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

// eslint-disable-next-line require-jsdoc
async function getCoordsForAddressPostalCodeCity(address, postalCode, city) {
  const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=
      ${encodeURIComponent(
      address, postalCode, city,
  )}&key=${API_KEY}`,
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
        'Could not find location for the specified address.',
        422,
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
module.exports = getCoordsForAddressPostalCodeCity;
