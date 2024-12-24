const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { logout } = require('../controllers/authController');

// POST route for login
router.post('/login', login);

// POST route for logout
router.post('/logout', logout);

module.exports = router;
