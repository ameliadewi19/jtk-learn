const express = require('express');
const {
    getAllHistoryQuiz,
    getHistoryQuizByID,
    upsertHistoryQuiz,
    getHistoryQuizByScore
} = require('../controllers/historyQuizController');
const router = express.Router();

router.get('/:id_pelajar', getAllHistoryQuiz); // Get all history quiz by id pelajar
router.get('/:id_pelajar/:id_quiz', getHistoryQuizByID);
router.put('/:id_pelajar/:id_quiz', upsertHistoryQuiz); //update, create if not exist
router.get('/:id_pelajar/:id_quiz/:nilai', getHistoryQuizByScore);

module.exports = router;