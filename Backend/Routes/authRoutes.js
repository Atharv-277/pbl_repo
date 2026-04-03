const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');

// Remove image upload route and storage setup.

// Auth routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
