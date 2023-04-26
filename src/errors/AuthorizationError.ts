module.exports = class AuthorizationError extends Error {
  public statusCode: Number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
};
