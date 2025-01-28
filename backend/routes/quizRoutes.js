const express = require('express');
const { 
    getAllQuiz, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    getPertanyaanByQuizId,
    getJawabanByPertanyaanId,
    getHistoryQuizByID, 
    upsertHistoryQuiz
} = require('../controllers/quizController');
const router = express.Router();
const { getQuizByCourseId, getQuizByPengajarId, getQuizById, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { authorizeRole } = require('../middleware/authorizeRole');

// Routes for Quiz
router.get('/', getAllQuiz); // Get all quiz
router.get('/:id', getQuizById); // Get quiz by ID
router.post('/', createQuiz); // Create a new quiz
router.put('/:id', updateQuiz); // Update quiz by ID
router.delete('/:id', deleteQuiz); // Delete quiz by ID
router.get('/:id/pertanyaan', getPertanyaanByQuizId);
router.get('/:id/jawaban', getJawabanByPertanyaanId);
router.get('/:id_pelajar/:id_quiz', getHistoryQuizByID);
router.put('/:id_pelajar/:id_quiz', upsertHistoryQuiz); //update, create if not exist

module.exports = router;