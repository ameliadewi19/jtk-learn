const express = require('express');
const {
    getAllHistoryQuiz,
} = require('../controllers/historyQuizController');
const e = require('express');
const router = express.Router();

router.get('/:id_pelajar', getAllHistoryQuiz); // Get all history quiz by id pelajar

module.exports = router;