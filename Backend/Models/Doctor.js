const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: String,
    qualification: String,
    experience: String,
    licenceNo: String,
    hospitalName: String,
    fees: Number,
    blockedSlots: [
        {
            date: { type: String, required: true }, // YYYY-MM-DD
            from: { type: String, required: true }, // HH:mm
            to: { type: String, required: true },   // HH:mm
            reason: { type: String, default: 'Busy' }
        }
    ]
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
