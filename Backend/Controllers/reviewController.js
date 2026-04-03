
const Review = require('../Models/Review');

exports.addReview = async (req, res) => {
    try {
        const { doctor, patient, rating, comment } = req.body;

        // Optional: Validate
        if (!doctor || !patient || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const review = await Review.create({
            doctor,
            patient,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error("Review creation error:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.getDoctorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.doctorId }).populate('patient');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
