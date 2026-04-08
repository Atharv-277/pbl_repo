const Doctor = require('../Models/Doctor');
const Patient = require('../Models/Patient');
const Review = require('../Models/Review');
const User = require('../Models/User');
const Appointment = require('../Models/Appointments');
const multer = require('multer');

const toMinutes = (timeValue) => {
    if (!timeValue || typeof timeValue !== 'string') return NaN;
    const [hours, minutes] = timeValue.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
    return hours * 60 + minutes;
};

// Get all doctors (public route)
exports.getAllDoctors = async (req, res) => {
    try {
        console.log('Fetching all doctors...');
        const doctors = await Doctor.find()
            .populate('userId', 'name email phoneNo gender address')
            .select('-__v');
        
        console.log('Doctors found:', doctors.length);
        
        const doctorsWithUserData = doctors.map(doctor => {
            console.log('Doctor data:', {
                _id: doctor._id,
                userId: doctor.userId,
                name: doctor.userId?.name,
            });
            
            return {
                _id: doctor._id,
                userId: doctor.userId,
                specialization: doctor.specialization,
                qualification: doctor.qualification,
                experiance: doctor.experience, // Fix field name
                licenceNo: doctor.licenceNo,
                HospitalName: doctor.hospitalName, // Fix field name
                fees: doctor.fees,
                blockedSlots: doctor.blockedSlots || [],
                name: doctor.userId?.name || 'Unknown',
                email: doctor.userId?.email || '',
                phoneNo: doctor.userId?.phoneNo || '',
                gender: doctor.userId?.gender || '',
                address: doctor.userId?.address || ''
            };
        });
        
        console.log('Processed doctors data:', doctorsWithUserData.length);
        res.json(doctorsWithUserData);
    } catch (error) {
        console.error('Error in getAllDoctors:', error);
        res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
};

// Get all patients assigned to doctor
exports.getMyPatients = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        const patients = await Patient.find({ doctor: doctor._id })
            .populate('userId', 'name email phoneNo gender address');
        
        const patientsWithUserData = patients.map(patient => ({
            _id: patient._id,
            userId: {
                _id: patient.userId?._id,
                name: patient.userId?.name || 'Unknown',
                email: patient.userId?.email || '',
                phoneNo: patient.userId?.phoneNo || '',
                gender: patient.userId?.gender || '',
                address: patient.userId?.address || ''
            }
        }));
        
        res.json(patientsWithUserData);
    } catch (error) {
        console.error('Error in getMyPatients:', error);
        res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
};

// Get reviews for logged-in doctor
exports.getMyReviews = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        const reviews = await Review.find({ doctor: doctor._id })
            .populate('patient', 'name email')
            .populate('doctor', 'specialization');
        res.json(reviews);
    } catch (error) {
        console.error('Error in getMyReviews:', error);
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Delete patient record for the logged-in doctor (removes doctor mapping and related appointments)
exports.deleteMyPatientRecord = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient record not found" });
        }

        if (!patient.doctor || patient.doctor.toString() !== doctor._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own patient records" });
        }

        await Appointment.deleteMany({ doctor: doctor._id, patient: patient._id });

        patient.doctor = null;
        await patient.save();

        return res.status(200).json({
            message: "Patient record removed successfully",
            patientId: patient._id,
        });
    } catch (error) {
        console.error('Error deleting patient record:', error);
        return res.status(500).json({ message: "Failed to delete patient record", error: error.message });
    }
};

exports.getMyBlockedSlots = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        return res.status(200).json(doctor.blockedSlots || []);
    } catch (error) {
        console.error('Error fetching blocked slots:', error);
        return res.status(500).json({ message: 'Failed to fetch blocked slots', error: error.message });
    }
};

exports.addBlockedSlot = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const { date, from, to, reason } = req.body;
        if (!date || !from || !to) {
            return res.status(400).json({ message: 'date, from and to are required' });
        }

        const fromMinutes = toMinutes(from);
        const toMinutesValue = toMinutes(to);
        if (Number.isNaN(fromMinutes) || Number.isNaN(toMinutesValue) || fromMinutes >= toMinutesValue) {
            return res.status(400).json({ message: 'Invalid blocked slot time range' });
        }

        const overlaps = (doctor.blockedSlots || []).some((slot) => {
            if (slot.date !== date) return false;
            const existingFrom = toMinutes(slot.from);
            const existingTo = toMinutes(slot.to);
            return fromMinutes < existingTo && toMinutesValue > existingFrom;
        });

        if (overlaps) {
            return res.status(409).json({ message: 'Blocked slot overlaps with an existing slot' });
        }

        doctor.blockedSlots.push({
            date,
            from,
            to,
            reason: (typeof reason === 'string' && reason.trim()) ? reason.trim() : 'Busy',
        });

        await doctor.save();
        return res.status(201).json(doctor.blockedSlots || []);
    } catch (error) {
        console.error('Error adding blocked slot:', error);
        return res.status(500).json({ message: 'Failed to add blocked slot', error: error.message });
    }
};

exports.deleteBlockedSlot = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const { slotId } = req.params;
        const initialLength = (doctor.blockedSlots || []).length;
        doctor.blockedSlots = (doctor.blockedSlots || []).filter(
            (slot) => String(slot._id) !== String(slotId)
        );

        if (doctor.blockedSlots.length === initialLength) {
            return res.status(404).json({ message: 'Blocked slot not found' });
        }

        await doctor.save();
        return res.status(200).json(doctor.blockedSlots || []);
    } catch (error) {
        console.error('Error deleting blocked slot:', error);
        return res.status(500).json({ message: 'Failed to delete blocked slot', error: error.message });
    }
};
