const express = require('express');
const router = express.Router();
const {
  categoryCreateDataValidation,
  categoryUpadeDataValidation,
} = require('../validation/category');
const { execValidation } = require('../validation');
const { requireAuth, adminMiddleware } = require('../controllers/auth');
const {
  createCategory,
  showAllCategories,
  showSingleCategory,
  updateCategory,
  removeCategory,
} = require('../controllers/category');

router.post(
  '/category',
  categoryCreateDataValidation,
  execValidation,
  requireAuth,
  adminMiddleware,
  createCategory
);

router.get('/categories', showAllCategories);
router.post('/category/:slug', showSingleCategory);
router.put(
  '/category/:slug',
  categoryUpadeDataValidation,
  execValidation,
  requireAuth,
  adminMiddleware,
  updateCategory
);
router.delete('/category/:slug', requireAuth, adminMiddleware, removeCategory);

module.exports = router;
