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
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');
const {
  registerUserDataValidation,
  loginUserDataValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../validation/auth');
const { execValidation } = require('../validation');

router.post('/register', registerUserDataValidation, execValidation, register);
router.post('/register/activate', emailConfirmationOnRegister);
router.post('/login', loginUserDataValidation, execValidation, login);
router.get('/user', requireAuth, authMiddleware, showProfile);
router.get('/admin', requireAuth, adminMiddleware, showProfile);
router.put(
  '/forgot-password',
  forgotPasswordValidation,
  execValidation,
  forgotPassword
);
router.put(
  '/reset-password',
  resetPasswordValidation,
  execValidation,
  resetPassword
);

module.exports = router;
