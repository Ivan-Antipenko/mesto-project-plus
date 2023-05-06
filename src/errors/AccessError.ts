module.exports = class AccessError extends Error {
  public statusCode: Number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
};
