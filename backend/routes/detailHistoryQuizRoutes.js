const express = require('express');
const router = express.Router();
const { 
        getAllDetailHistQuizByHistQuizID,
        getDetailHistoryQuizPelajar,
        getDetailHistoryQuizData, 
        upsertDetailHistoryQuiz 
    } = require('../controllers/detailHistoryQuizController');
const { authorizeRole } = require('../middleware/authorizeRole');

router.get('/:id_history_quiz', authorizeRole(['pelajar']), getAllDetailHistQuizByHistQuizID);
router.get('/data/:id_quiz', authorizeRole(['pengajar']), getDetailHistoryQuizData);
router.put('/detail',authorizeRole(['pelajar']), upsertDetailHistoryQuiz);

module.exports = router;