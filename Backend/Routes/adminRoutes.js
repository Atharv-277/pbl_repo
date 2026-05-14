const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const { adminOnly } = require('../Middleware/adminMiddleware');
const {
    getPendingDoctors,
    getAllDoctorsAdmin,
    approveDoctor,
    rejectDoctor,
    getDashboardStats
} = require('../Controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/pending-doctors', getPendingDoctors);
router.get('/doctors', getAllDoctorsAdmin);
router.patch('/doctors/:doctorId/approve', approveDoctor);
router.patch('/doctors/:doctorId/reject', rejectDoctor);

module.exports = router;
