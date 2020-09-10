const express = require('express');
const router = express.Router();
const {
  register,
  emailConfirmationOnRegister,
  login,
} = require('../controllers/auth');
const {
  registerUserDataValidation,
  loginUserDataValidation,
} = require('../validation/auth');
const { execValidation } = require('../validation');

router.post('/register', registerUserDataValidation, execValidation, register);
router.post('/register/activate', emailConfirmationOnRegister);
router.post('/login', loginUserDataValidation, execValidation, login);

module.exports = router;
