const { check } = require('express-validator');

exports.categoryCreateDataValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('image').not().isEmpty().withMessage('Image is required'),
  check('content')
    .isLength({ min: 20 })
    .withMessage(
      'Description is required and should be at least 20 charackters long'
    ),
];

exports.categoryUpadeDataValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('content')
    .isLength({ min: 20 })
    .withMessage(
      'Description is required and should be at least 20 charackters long'
    ),
];
