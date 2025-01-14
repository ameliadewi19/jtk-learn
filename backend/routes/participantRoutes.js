const express = require('express');
const { getCParticipantByStudent } = require('../controllers/participantController');
const router = express.Router();

// Routes for Course taken by student
router.get('/pelajar/:id', getCParticipantByStudent); // Get course by ID

module.exports = router;

