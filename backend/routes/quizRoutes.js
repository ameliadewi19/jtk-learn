const express = require('express');
const { 
    getAllQuiz, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz 
} = require('../controllers/quizController');
const router = express.Router();

// Routes for Quiz
router.get('/', getAllQuiz); // Get all quiz
router.get('/:id', getQuizById); // Get quiz by ID
router.post('/', createQuiz); // Create a new quiz
router.put('/:id', updateQuiz); // Update quiz by ID
router.delete('/:id', deleteQuiz); // Delete quiz by ID

module.exports = router;
