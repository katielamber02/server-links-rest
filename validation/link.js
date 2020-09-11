const { check } = require('express-validator');

exports.linkCreateDataValidation = [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('url').not().isEmpty().withMessage('Url is required'),
  check('categories').not().isEmpty().withMessage('Pick a categorie'),
  check('type').not().isEmpty().withMessage('Pick a type free or paid'),
  check('medium').not().isEmpty().withMessage('Pick a a medium book or video'),
];
exports.linkUpdateDataValidation = [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('url').not().isEmpty().withMessage('Url is required'),
  check('categories').not().isEmpty().withMessage('Pick a categorie'),
  check('type').not().isEmpty().withMessage('Pick a type free or paid'),
  check('medium').not().isEmpty().withMessage('Pick a a medium book or video'),
];
