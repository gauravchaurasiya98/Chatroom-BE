class CustomError extends Error {
  constructor(message, code, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = this.constructor.name;
  }
}

module.exports = CustomError;
