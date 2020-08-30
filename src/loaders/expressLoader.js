const bodyParser = require('body-parser');
const logger = require('winston');
const fs = require('fs');
const cors = require('cors');

const HttpError = require('../models/Http-error');
const userRouter = require('../routers/user');
const petUserRouter = require('../routers/petUser');
const shelterRouter = require('../routers/shelter');
const petShelterRouter = require('../routers/petShelter');
const adoptionRouter = require('../routers/adoption');
const vetRouter = require('../routers/vet');
const crecheRouter = require('../routers/creche');
const shopRouter = require('../routers/shop');

const expressLoader = function(app) {
  app.get('/status', (req, res, next) => {
    res.sendStatus(200);
  });
  app.head('/status', (req, res, next) => {
    res.sendStatus(200);
  });

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(cors());

  app.use(userRouter);
  app.use(petUserRouter);
  app.use(adoptionRouter);
  app.use(shelterRouter);
  app.use(petShelterRouter);
  app.use(vetRouter);
  app.use(crecheRouter);
  app.use(shopRouter);

  app.use((req, res, next) => {
    throw new HttpError('Could not find this route.', 404);
  });

  app.use((error, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  app.use(function(req, res, next) {
    const err = new Error('Not found route');
    err.name = 'Not found route';
    next(err);
  });

  app.use(function(err, req, res, next) {
    switch (err.name) {
      case 'NotFound':
        err['status'] = 404;
        break;
      case 'Unauthorized':
        err['status'] = 401;
        break;
      default:
        err['status'] = 500;
    }

    logger.error(err);
    res.status(err.status).json({errors: [err.name]});
  });
};

module.exports = expressLoader;
