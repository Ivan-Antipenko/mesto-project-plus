module.exports = class ConflictError extends Error {
  public statusCode: Number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
};
