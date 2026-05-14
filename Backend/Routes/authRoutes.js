const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, login } = require('../Controllers/authController');

// Multer storage for doctor licence certificates and profile photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'licenceCertificate') {
            cb(null, 'uploads/doctor-certificates');
        } else if (file.fieldname === 'profileImage') {
            cb(null, 'uploads/profile-photos');
        } else {
            cb(null, 'uploads');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG and PDF files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Auth routes — accept both certificate and profile photo
router.post('/register', upload.fields([
    { name: 'licenceCertificate', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 }
]), register);
router.post('/login', login);

module.exports = router;

