const express = require('express');
const { 
    getAllQuiz, 
    getQuizByCourseId,
    getQuizByPengajarId,
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
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

module.exports = router;