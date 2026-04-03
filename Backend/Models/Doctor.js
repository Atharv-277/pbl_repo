const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: String,
    qualification: String,
    experience: String,
    licenceNo: String,
    hospitalName: String,
    fees: Number
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
