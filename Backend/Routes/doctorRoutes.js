const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const {
    getMyPatients,
    getMyReviews,
    getAllDoctors,
    deleteMyPatientRecord,
    getMyBlockedSlots,
    addBlockedSlot,
    deleteBlockedSlot,
} = require('../Controllers/doctorController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/doctor-profiles'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', getAllDoctors); // Get all doctors (public route)
router.get('/patients', protect, getMyPatients);
router.get('/reviews', protect, getMyReviews);
router.get('/blocked-slots', protect, getMyBlockedSlots);
router.post('/blocked-slots', protect, addBlockedSlot);
router.delete('/blocked-slots/:slotId', protect, deleteBlockedSlot);
router.delete('/patients/:patientId', protect, deleteMyPatientRecord);

module.exports = router;
