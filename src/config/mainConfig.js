module.exports = {
  app: {
    port: process.env.EXPRESS_PORT || 3000,
    morgan: process.env.MORGAN || 'dev',
    db_uri: process.env.DB_URI || 'mongodb//localhost:27017',
    secret: process.env.SECRET || 'supersecret_dont_share',
  },
  secret: 'supersecret_dont_share',
};
