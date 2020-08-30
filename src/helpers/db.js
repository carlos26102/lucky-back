const mongoose = require('mongoose');

const config = require('../config/mainConfig');
const app = require('../app');

// eslint-disable-next-line max-len
const connectionOptions = {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};

mongoose
// eslint-disable-next-line max-len
    .connect(process.env.DB_URI || config.app.db_uri, connectionOptions)
    .then(() => {
      app.boostrapServer();
      console.log('DB connected!');
    })
    .catch((err) => {
      console.log(err);
      console.log('Can\'t connect DB');
    });

mongoose.Promise = global.Promise;

module.exports = {
  User: require('../models/User'),
  Shelter: require('../models/Shelter'),
  Pet: require('../models/Pet'),
  Adoption: require('../models/Adoption'),
  // RefreshToken: require('../models/Refresh-token'),
  isValidId,
};

// eslint-disable-next-line require-jsdoc
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
