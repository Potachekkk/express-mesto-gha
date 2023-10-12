const { BAD_REQUEST_STATUS } = require('../config/config');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS;
  }
}

module.exports = BadRequest;
