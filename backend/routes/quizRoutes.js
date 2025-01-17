const express = require('express');
const router = express.Router();
const { getAllPilihanJawaban } = require('../controllers/jawabanController');
const { getAllPertanyaan } = require('../controllers/pertanyaanController');
const { getAllQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { authorizeRole } = require('../middleware/authorizeRole');

// Routes for Quiz
router.get('/', getAllQuiz); // Get all quizzes
router.post('/', authorizeRole(['pengajar']), createQuiz); // Create a new quiz
router.put('/:id', authorizeRole(['pengajar']), updateQuiz); // Update quiz by ID
router.delete('/:id', authorizeRole(['pengajar']), deleteQuiz); // Delete quiz by ID

module.exports = router;