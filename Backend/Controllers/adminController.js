const Doctor = require('../Models/Doctor');
const User = require('../Models/User');

// Get all pending doctor registrations
exports.getPendingDoctors = async (req, res) => {
    try {
        const pendingDoctors = await Doctor.find({ status: 'pending' })
            .populate('userId', 'name email phoneNo gender address profileImage')
            .select('-__v');

        const formatted = pendingDoctors.map(doctor => ({
            _id: doctor._id,
            userId: doctor.userId?._id,
            name: doctor.userId?.name || 'Unknown',
            email: doctor.userId?.email || '',
            phoneNo: doctor.userId?.phoneNo || '',
            gender: doctor.userId?.gender || '',
            address: doctor.userId?.address || '',
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experience: doctor.experience,
            licenceNo: doctor.licenceNo,
            hospitalName: doctor.hospitalName,
            licenceCertificate: doctor.licenceCertificate,
            fees: doctor.fees,
            status: doctor.status,
            profileImage: doctor.userId?.profileImage || null,
            createdAt: doctor._id.getTimestamp()
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching pending doctors:', error);
        res.status(500).json({ message: 'Error fetching pending doctors', error: error.message });
    }
};

// Get all doctors (with status)
exports.getAllDoctorsAdmin = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('userId', 'name email phoneNo gender address profileImage')
            .select('-__v');

        const formatted = doctors.map(doctor => ({
            _id: doctor._id,
            userId: doctor.userId?._id,
            name: doctor.userId?.name || 'Unknown',
            email: doctor.userId?.email || '',
            phoneNo: doctor.userId?.phoneNo || '',
            gender: doctor.userId?.gender || '',
            address: doctor.userId?.address || '',
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experience: doctor.experience,
            licenceNo: doctor.licenceNo,
            hospitalName: doctor.hospitalName,
            licenceCertificate: doctor.licenceCertificate,
            fees: doctor.fees,
            status: doctor.status,
            profileImage: doctor.userId?.profileImage || null,
            createdAt: doctor._id.getTimestamp()
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching all doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

// Approve a doctor
exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.status = 'approved';
        await doctor.save();

        const user = await User.findById(doctor.userId).select('name email');

        res.json({
            message: `Dr. ${user?.name || 'Doctor'} has been approved successfully.`,
            doctor: {
                _id: doctor._id,
                status: doctor.status,
                name: user?.name,
                email: user?.email
            }
        });
    } catch (error) {
        console.error('Error approving doctor:', error);
        res.status(500).json({ message: 'Error approving doctor', error: error.message });
    }
};

// Reject a doctor
exports.rejectDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.status = 'rejected';
        await doctor.save();

        const user = await User.findById(doctor.userId).select('name email');

        res.json({
            message: `Dr. ${user?.name || 'Doctor'}'s registration has been rejected.`,
            doctor: {
                _id: doctor._id,
                status: doctor.status,
                name: user?.name,
                email: user?.email
            }
        });
    } catch (error) {
        console.error('Error rejecting doctor:', error);
        res.status(500).json({ message: 'Error rejecting doctor', error: error.message });
    }
};

// Block an approved doctor
exports.blockDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (doctor.status !== 'approved') {
            return res.status(400).json({ message: 'Only approved doctors can be blocked' });
        }

        doctor.status = 'blocked';
        await doctor.save();

        const user = await User.findById(doctor.userId).select('name email');

        res.json({
            message: `Dr. ${user?.name || 'Doctor'} has been blocked.`,
            doctor: {
                _id: doctor._id,
                status: doctor.status,
                name: user?.name,
                email: user?.email
            }
        });
    } catch (error) {
        console.error('Error blocking doctor:', error);
        res.status(500).json({ message: 'Error blocking doctor', error: error.message });
    }
};

// Unblock a blocked doctor
exports.unblockDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (doctor.status !== 'blocked') {
            return res.status(400).json({ message: 'Only blocked doctors can be unblocked' });
        }

        doctor.status = 'approved';
        await doctor.save();

        const user = await User.findById(doctor.userId).select('name email');

        res.json({
            message: `Dr. ${user?.name || 'Doctor'} has been unblocked.`,
            doctor: {
                _id: doctor._id,
                status: doctor.status,
                name: user?.name,
                email: user?.email
            }
        });
    } catch (error) {
        console.error('Error unblocking doctor:', error);
        res.status(500).json({ message: 'Error unblocking doctor', error: error.message });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const pending = await Doctor.countDocuments({ status: 'pending' });
        const approved = await Doctor.countDocuments({ status: 'approved' });
        const rejected = await Doctor.countDocuments({ status: 'rejected' });
        const blocked = await Doctor.countDocuments({ status: 'blocked' });
        const total = pending + approved + rejected + blocked;

        res.json({ total, pending, approved, rejected, blocked });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
