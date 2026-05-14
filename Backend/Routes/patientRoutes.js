const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../Middleware/authMiddleware');
const { getDashboard, assignDoctor, createPatient, getOrCreatePatient, updateProfilePhoto } = require('../Controllers/patientController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/profile-photos'),
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

router.get('/dashboard', protect, getDashboard);
router.patch('/assignDoctor', protect, assignDoctor);
router.post('/', createPatient);
router.get('/profile', protect, getOrCreatePatient);
router.put('/profile-photo', protect, upload.single('profileImage'), updateProfilePhoto);

module.exports = router;

