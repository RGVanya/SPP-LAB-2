// Ожидаемая ошибка приложения: её статус и текст уходят клиенту как JSON.
class AppError extends Error {
  constructor(message, statusCode = 400, fields = null) {
    super(message);
    this.statusCode = statusCode;
    this.fields = fields;
  }
}

module.exports = AppError;
