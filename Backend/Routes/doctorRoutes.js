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
    updateProfilePhoto,
} = require('../Controllers/doctorController');
const multer = require('multer');
const path = require('path');

const profilePhotosDir = path.join(__dirname, '..', 'uploads', 'profile-photos');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, profilePhotosDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG and PNG images are allowed'), false);
    }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getAllDoctors); // Get all doctors (public route)
router.get('/patients', protect, getMyPatients);
router.get('/reviews', protect, getMyReviews);
router.get('/blocked-slots', protect, getMyBlockedSlots);
router.post('/blocked-slots', protect, addBlockedSlot);
router.delete('/blocked-slots/:slotId', protect, deleteBlockedSlot);
router.delete('/patients/:patientId', protect, deleteMyPatientRecord);
router.put('/profile-photo', protect, upload.single('profileImage'), updateProfilePhoto);

module.exports = router;

