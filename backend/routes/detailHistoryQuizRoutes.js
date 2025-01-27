const express = require('express');
const router = express.Router();
const { getDetailHistoryQuizData } = require('../controllers/detailHistoryQuizController');
const { authorizeRole } = require('../middleware/authorizeRole');

router.get('/:id_quiz', authorizeRole(['pengajar']), getDetailHistoryQuizData);

module.exports = router;