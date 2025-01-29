const express = require('express');
const { getCParticipantByStudent, getProgressByCourse, enrollCourse, updateParticipant } = require('../controllers/participantController');
const { verifyEnrollment } = require('../middleware/verifyEnrollment');
const router = express.Router();

// Routes for Course taken by student
router.get('/pelajar/:id', getCParticipantByStudent); // Get course by ID
router.get('/progress/:id_course/:id_pelajar', verifyEnrollment, getProgressByCourse); // Get progress by course ID and student ID
router.post('/enroll', enrollCourse); // Enroll course
router.put('/progress', updateParticipant);

module.exports = router;

