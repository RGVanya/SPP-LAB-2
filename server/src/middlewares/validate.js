const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const fields = {};
  for (const error of result.array()) {
    const key = error.path || 'form';
    if (!fields[key]) fields[key] = error.msg;
  }

  res.status(400).json({
    message: 'Проверьте введённые данные',
    fields,
  });
}

module.exports = { handleValidation };
