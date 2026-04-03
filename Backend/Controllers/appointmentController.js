const Appointment = require('../Models/Appointments');
const Doctor = require('../Models/Doctor');
const Patient = require('../Models/Patient');
const mongoose = require('mongoose');

const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled'];

const patientPopulate = {
  path: 'patient',
  populate: {
    path: 'userId',
    select: 'name email profileImage phoneNo gender address'
  }
};

const doctorPopulate = {
  path: 'doctor',
  populate: {
    path: 'userId',
    select: 'name email profileImage phoneNo gender address'
  }
};

async function resolveDoctorFromUser(user) {
  if (!user?._id) return null;
  return Doctor.findOne({ userId: user._id });
}

async function resolvePatientFromPatientOrUserId(patientId) {
  if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
    return null;
  }

  const byPatientId = await Patient.findById(patientId);
  if (byPatientId) return byPatientId;

  return Patient.findOne({ userId: patientId });
}

exports.testPatientData = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId');
    const appointments = await Appointment.find().populate(patientPopulate);
    res.json({ patients, appointments });
  } catch (err) {
    res.status(500).json({ message: 'Test failed', error: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, description, time } = req.body;

    if (!doctorId || !patientId || !appointmentDate || !time) {
      return res.status(400).json({ message: 'doctorId, patientId, appointmentDate and time are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid doctorId' });
    }

    const patient = await resolvePatientFromPatientOrUserId(patientId);
    if (!patient) {
      return res.status(400).json({ message: 'Patient not found. Please complete patient profile first.' });
    }

    const parsedDate = new Date(appointmentDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date' });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctor: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked for the selected doctor' });
    }

    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      appointmentDate: parsedDate,
      time,
      description: typeof description === 'string' ? description.trim() : '',
      doctorNote: ''
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment', error: err.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = String(req.params.doctorId || '').trim();
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate(patientPopulate)
      .sort({ appointmentDate: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor's appointments", error: err.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate(doctorPopulate)
      .sort({ appointmentDate: -1, time: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const doctor = await resolveDoctorFromUser(req.user);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate(patientPopulate)
      .sort({ appointmentDate: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
};

exports.getMyAppointmentsForPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate(doctorPopulate)
      .sort({ appointmentDate: -1, time: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await resolveDoctorFromUser(req.user);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate(patientPopulate)
      .sort({ appointmentDate: 1, time: 1 });

    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const todayCount = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= startOfToday && aptDate <= endOfToday;
    }).length;

    const monthCount = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= monthStart && aptDate <= monthEnd;
    }).length;

    const completedCount = appointments.filter((apt) => apt.status === 'completed').length;

    const uniquePatients = new Set(
      appointments
        .map((apt) => apt.patient?._id?.toString())
        .filter(Boolean)
    );

    res.status(200).json({
      stats: {
        totalAppointments: appointments.length,
        todayAppointments: todayCount,
        monthAppointments: monthCount,
        completedAppointments: completedCount,
        activePatients: uniquePatients.size,
        completionRate: appointments.length ? Math.round((completedCount / appointments.length) * 100) : 0,
      },
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load doctor dashboard', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, doctorNote } = req.body;

    if (typeof status !== 'undefined' && !APPOINTMENT_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const doctor = await resolveDoctorFromUser(req.user);
    if (!doctor) {
      return res.status(403).json({ message: 'Only doctors can update appointment details' });
    }

    const appointment = await Appointment.findById(id).populate(patientPopulate);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (String(appointment.doctor) !== String(doctor._id)) {
      return res.status(403).json({ message: 'You can only update your own appointments' });
    }

    if (typeof status !== 'undefined') {
      appointment.status = status;
    }

    if (typeof doctorNote === 'string') {
      appointment.doctorNote = doctorNote.trim();
    }

    await appointment.save();
    await appointment.populate(patientPopulate);

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update appointment details', error: err.message });
  }
};