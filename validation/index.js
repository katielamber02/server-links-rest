const { validationResult } = require('express-validator');

exports.execValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg, // the first error message only
    });
  }
  next();
};
