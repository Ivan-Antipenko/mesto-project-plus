module.exports = class BaseError extends Error {
  public statusCode: Number;

  constructor(message: string) {
    super(message);
    this.message = 'На сервере произошла ошибка';
    this.statusCode = 500;
  }
};
