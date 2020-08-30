// eslint-disable-next-line require-jsdoc
class HttpError extends Error {
  // eslint-disable-next-line require-jsdoc
  constructor(message, errorCode) {
    super(message); // Add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;
