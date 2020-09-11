const express = require('express');
const router = express.Router();
const {
  linkCreateDataValidation,
  linkUpdateDataValidation,
} = require('../validation/link');
const { execValidation } = require('../validation');
const { requireAuth, authMiddleware } = require('../controllers/auth');
const {
  createLink,
  showAllLinks,
  showSingleLink,
  removeLink,
  updateLink,
} = require('../controllers/link');

router.post(
  '/link',
  linkCreateDataValidation,
  execValidation,
  requireAuth,
  authMiddleware,
  createLink
);

router.get('/links', showAllLinks);
router.get('/link/:slug', showSingleLink);
router.put(
  '/link/:slug',
  linkUpdateDataValidation,
  execValidation,
  requireAuth,
  authMiddleware,
  updateLink
);
router.delete('/link/:slug', requireAuth, authMiddleware, removeLink);

module.exports = router;
