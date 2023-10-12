const { CONFLICT_STATUS } = require('../config/config');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_STATUS;
  }
}

module.exports = ConflictError;
