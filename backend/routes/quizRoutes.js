const express = require('express');
const { 
    getAllQuiz, 
    getQuizByCourseId,
    getQuizByPengajarId,
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    getHistoryQuizByID,
    upsertHistoryQuiz
} = require('../controllers/quizController');
const router = express.Router();
const { authorizeRole } = require('../middleware/authorizeRole');

// Routes for Quiz
router.get('/', getAllQuiz); // Get all quiz
router.get('/course/:id', authorizeRole(['pengajar', 'pelajar']), getQuizByCourseId); // Get all quizzes
router.get('/pengajar/:id', authorizeRole(['pengajar']), getQuizByPengajarId); // Get quiz by pengajar ID
router.get('/:id', authorizeRole(['pengajar', 'pelajar']), getQuizById); // Get quiz by ID
router.post('/', authorizeRole(['pengajar']), createQuiz); // Create a new quiz
router.put('/:id', authorizeRole(['pengajar']), updateQuiz); // Update quiz by ID
router.delete('/:id', authorizeRole(['pengajar']), deleteQuiz); // Delete quiz by ID
router.get('/:id_pelajar/:id_quiz', authorizeRole(['pengajar', 'pelajar']), getHistoryQuizByID);
router.put('/:id_pelajar/:id_quiz', authorizeRole(['pengajar', 'pelajar']), upsertHistoryQuiz); //update, create if not exist

module.exports = router;