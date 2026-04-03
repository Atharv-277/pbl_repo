const express = require('express');
const router = express.Router();
const { addReview, getDoctorReviews } = require('../Controllers/reviewController');

router.post('/', addReview);
router.get('/doctor/:doctorId', getDoctorReviews);

module.exports = router;
