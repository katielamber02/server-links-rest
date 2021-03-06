const { check } = require('express-validator');

exports.registerUserDataValidation = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('categories')
    .isLength({ min: 6 })
    .withMessage('Pick at least one category'),
];

exports.loginUserDataValidation = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

exports.forgotPasswordValidation = [
  check('email').isEmail().withMessage('Must be a valid email address'),
];

exports.resetPasswordValidation = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('newPassword')
    .not()
    .isEmpty({ min: 6 })
    .withMessage('Token is required'),
];
