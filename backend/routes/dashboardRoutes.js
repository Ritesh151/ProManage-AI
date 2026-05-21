const express = require('express');
const router = express.Router();
const { getDashboard, getAnalytics } = require('../controllers/dashboardController');

router.get('/', getDashboard);
router.get('/analytics', getAnalytics);

module.exports = router;
