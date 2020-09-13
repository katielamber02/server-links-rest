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
  canDeleteAndUpdateLink,
} = require('../controllers/auth');
const {
  createLink,
  // showAllLinks,
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

router.put(
  '/link/:id',
  linkUpdateDataValidation,
  execValidation,
  requireAuth,
  canDeleteAndUpdateLink,
  authMiddleware,

  updateLink
);
router.put(
  '/link/admin/:id',
  linkUpdateDataValidation,
  execValidation,
  requireAuth,
  adminMiddleware,
  updateLink
);
router.delete(
  '/link/:id',
  requireAuth,
  canDeleteAndUpdateLink,
  authMiddleware,

  removeLink
);
router.delete('/link/admin/:id', requireAuth, adminMiddleware, removeLink);
module.exports = router;
