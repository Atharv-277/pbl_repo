const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const { getDashboard, assignDoctor, createPatient, getOrCreatePatient } = require('../Controllers/patientController');

router.get('/dashboard', protect, getDashboard);
router.patch('/assignDoctor', protect, assignDoctor);
router.post('/', createPatient);
router.get('/profile', protect, getOrCreatePatient);

module.exports = router;
