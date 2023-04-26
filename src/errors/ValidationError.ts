module.exports = class NotFoundError extends Error {
  public statusCode: Number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
};
