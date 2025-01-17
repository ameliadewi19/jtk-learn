const express = require('express');
const { getCParticipantByStudent, getProgressByCourse } = require('../controllers/participantController');
const router = express.Router();

// Routes for Course taken by student
router.get('/pelajar/:id', getCParticipantByStudent); // Get course by ID
router.get('/progress/:id_course/:id_pelajar', getProgressByCourse); // Get progress by course ID and student ID

module.exports = router;

