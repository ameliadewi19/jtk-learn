const express = require('express');
const router = express.Router();
const { getAllJawaban } = require('../controllers/jawabanController');

// GET route for get user data
router.get('/', getAllJawaban);

module.exports = router;
