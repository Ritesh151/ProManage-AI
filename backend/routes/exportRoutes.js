const express = require('express');
const router = express.Router();
const { exportCSV, exportExcel, exportPDF } = require('../controllers/exportController');

router.get('/csv', exportCSV);
router.get('/excel', exportExcel);
router.get('/pdf', exportPDF);

module.exports = router;
