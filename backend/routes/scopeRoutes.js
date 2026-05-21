const express = require('express');
const scopeController = require('../controllers/scopeController');

const router = express.Router();

router.get('/', scopeController.getCategories);
router.get('/statistics', scopeController.getStatistics);
router.get('/:id', scopeController.getCategory);
router.post('/', scopeController.createCategory);
router.put('/:id', scopeController.updateCategory);
router.delete('/:id', scopeController.deleteCategory);

router.post('/:id/items', scopeController.createScopeItem);
router.put('/:categoryId/items/:itemId', scopeController.updateScopeItem);
router.delete('/:categoryId/items/:itemId', scopeController.deleteScopeItem);

module.exports = router;
