const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const { getMyPatients, getMyReviews, getAllDoctors, deleteMyPatientRecord } = require('../Controllers/doctorController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/doctor-profiles'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', getAllDoctors); // Get all doctors (public route)
router.get('/patients', protect, getMyPatients);
router.get('/reviews', protect, getMyReviews);
router.delete('/patients/:patientId', protect, deleteMyPatientRecord);

module.exports = router;
