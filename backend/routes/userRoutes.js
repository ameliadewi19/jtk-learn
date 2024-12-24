const express = require('express');
const router = express.Router();
const { getUserDataByRole } = require('../controllers/userController');

// GET route for get user data
router.get('/data', getUserDataByRole);

module.exports = router;
