const multer = require('multer');
const AppError = require('../errors/AppError');

function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Ресурс не найден' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: 'Файл больше 10 МБ',
        fields: { file: 'Файл больше 10 МБ' },
      });
    }
    return res.status(400).json({
      message: 'Не удалось принять файл',
      fields: { file: 'Не удалось принять файл' },
    });
  }

  if (err instanceof AppError) {
    const body = { message: err.message };
    if (err.fields) body.fields = err.fields;
    return res.status(err.statusCode).json(body);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Некорректный JSON' });
  }

  console.error(err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
}

module.exports = { notFoundHandler, errorHandler };
