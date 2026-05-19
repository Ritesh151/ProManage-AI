const express = require('express');
const router = express.Router();
const { generateProposal, downloadPDF, downloadWord } = require('../controllers/proposalController');

router.get('/generate/:id', generateProposal);
router.get('/pdf/:id', downloadPDF);
router.get('/word/:id', downloadWord);

module.exports = router;
