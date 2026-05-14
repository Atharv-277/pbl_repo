const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointmentDate: { type: Date, required: true },
    time: { type: String }, // if needed
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'approved', 'rejected'], default: 'scheduled' },
    description: { type: String },
    doctorNote: { type: String, default: '' },
    createdByRole: { type: String, enum: ['doctor', 'patient'], default: 'patient' }
}, { timestamps: true });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
