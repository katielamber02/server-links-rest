const express = require('express');
const router = express.Router();
const { register, activateEmailRegister } = require('../controllers/auth');
const { registerUserDataValidation } = require('../validation/auth');
const { execValidation } = require('../validation');

router.post('/register', registerUserDataValidation, execValidation, register);
router.post('/register/activate', activateEmailRegister);

module.exports = router;
