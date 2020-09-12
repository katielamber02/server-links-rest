const express = require('express');
const router = express.Router();
const {
  linkCreateDataValidation,
  linkUpdateDataValidation,
} = require('../validation/link');
const { execValidation } = require('../validation');
const {
  requireAuth,
  authMiddleware,
  adminMiddleware,
} = require('../controllers/auth');
const {
  createLink,
  // showAllLinks,
  showSingleLink,
  removeLink,
  updateLink,
  clickCount,
  showAllLinksToAdmin,
} = require('../controllers/link');

router.post(
  '/link',
  linkCreateDataValidation,
  execValidation,
  requireAuth,
  authMiddleware,
  createLink
);

// router.get('/links', showAllLinks);
router.post('/links', requireAuth, adminMiddleware, showAllLinksToAdmin);

router.put('/click-count', clickCount);
router.get('/link/:slug', showSingleLink);
router.put(
  '/link/:id',
  linkUpdateDataValidation,
  execValidation,
  requireAuth,
  authMiddleware,
  updateLink
);
router.delete('/link/:id', requireAuth, authMiddleware, removeLink);

module.exports = router;
