const express = require('express');
const { getCParticipantByStudent, updateParticipant } = require('../controllers/participantController');
const router = express.Router();

// Routes for Course taken by student
router.get('/pelajar/:id', getCParticipantByStudent); // Get course by ID
router.put('/progress', updateParticipant);

module.exports = router;

