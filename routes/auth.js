const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth');
const { registerUserDataValidation } = require('../validation/auth');
const { execValidation } = require('../validation');

router.post('/register', registerUserDataValidation, execValidation, register);

module.exports = router;
