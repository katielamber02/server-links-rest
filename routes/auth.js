const express = require('express');
const router = express.Router();
const {
  register,
  emailConfirmationOnRegister,
  login,
  requireAuth,
  authMiddleware,
  adminMiddleware,
  showProfile,
} = require('../controllers/auth');
const {
  registerUserDataValidation,
  loginUserDataValidation,
} = require('../validation/auth');
const { execValidation } = require('../validation');

router.post('/register', registerUserDataValidation, execValidation, register);
router.post('/register/activate', emailConfirmationOnRegister);
router.post('/login', loginUserDataValidation, execValidation, login);
router.get('/user', requireAuth, authMiddleware, showProfile);
router.get('/admin', requireAuth, adminMiddleware, showProfile);
module.exports = router;
