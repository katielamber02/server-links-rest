const { check } = require('express-validator');

exports.categoryCreateDataValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('image').isEmpty().withMessage('Image is required'),
  check('content').isLength({ min: 20 }).withMessage('Description is required'),
];
exports.categoryUpadeDataValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),

  check('content').isLength({ min: 20 }).withMessage('Description is required'),
];
