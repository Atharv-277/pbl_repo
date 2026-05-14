const Appointment = require('../Models/Appointments');
const Doctor = require('../Models/Doctor');
const Patient = require('../Models/Patient');
const mongoose = require('mongoose');

const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'approved', 'rejected'];

const toMinutes = (timeValue) => {
  if (!timeValue || typeof timeValue !== 'string') return NaN;
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
  return hours * 60 + minutes;
};

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

    const requesterRole = req.user?.role;
    const requesterUserId = req.user?._id;

    let resolvedPatientId = patientId;
    let requesterDoctor = null;
    if (requesterRole === 'patient') {
      const requesterPatient = await Patient.findOne({ userId: requesterUserId });
      if (!requesterPatient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      resolvedPatientId = requesterPatient._id;
    } else if (requesterRole === 'doctor') {
      requesterDoctor = await Doctor.findOne({ userId: requesterUserId });
      if (!requesterDoctor || String(requesterDoctor._id) !== String(doctor._id)) {
        return res.status(403).json({ message: 'Doctors can only create appointments for themselves' });
      }
    }

    const patient = await resolvePatientFromPatientOrUserId(resolvedPatientId);
    if (!patient) {
      return res.status(400).json({ message: 'Patient not found. Please complete patient profile first.' });
    }

    if (requesterRole === 'doctor' && requesterDoctor) {
      const hasCompletedVisit = await Appointment.exists({
        doctor: requesterDoctor._id,
        patient: patient._id,
        status: { $in: ['completed', 'approved'] }
      });

      if (!hasCompletedVisit) {
        return res.status(403).json({ message: 'Follow-up can be booked only for patients who already visited you.' });
      }
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

    const appointmentDateKey = parsedDate.toISOString().split('T')[0];
    const selectedTimeMinutes = toMinutes(time);
    const blockedSlots = doctor.blockedSlots || [];

    const isBlocked = blockedSlots.some((slot) => {
      if (slot.date !== appointmentDateKey) return false;
      const fromMinutes = toMinutes(slot.from);
      const toMinutesValue = toMinutes(slot.to);
      if (Number.isNaN(fromMinutes) || Number.isNaN(toMinutesValue)) return false;
      return selectedTimeMinutes >= fromMinutes && selectedTimeMinutes < toMinutesValue;
    });

    if (isBlocked) {
      return res.status(409).json({ message: 'No doctor available at this time. Please choose another slot.' });
    }

    const appointment = await Appointment.create({
      doctor: doctor._id,
      patient: patient._id,
      appointmentDate: parsedDate,
      time,
      description: typeof description === 'string' ? description.trim() : '',
      doctorNote: '',
      createdByRole: requesterRole === 'doctor' ? 'doctor' : 'patient'
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

    const completedCount = appointments.filter((apt) => apt.status === 'completed' || apt.status === 'approved').length;

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

    const appointment = await Appointment.findById(id).populate(patientPopulate);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user?.role === 'doctor') {
      const doctor = await resolveDoctorFromUser(req.user);
      if (!doctor) {
        return res.status(403).json({ message: 'Only doctors can update appointment details' });
      }

      if (String(appointment.doctor) !== String(doctor._id)) {
        return res.status(403).json({ message: 'You can only update your own appointments' });
      }

      if (typeof status !== 'undefined') {
        // Prevent marking future appointments as completed
        if (status === 'completed') {
          const appointmentDate = new Date(appointment.appointmentDate);
          const today = new Date();
          // Compare dates only (ignore time), so same-day appointments can be completed
          appointmentDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          if (appointmentDate > today) {
            return res.status(400).json({
              message: 'Cannot mark a future appointment as completed. Please wait until the appointment date.'
            });
          }
        }
        appointment.status = status;
      }

      if (typeof doctorNote === 'string') {
        appointment.doctorNote = doctorNote.trim();
      }
    } else if (req.user?.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || String(appointment.patient?._id || appointment.patient) !== String(patient._id)) {
        return res.status(403).json({ message: 'You can only update your own appointments' });
      }

      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Patients can only cancel appointments' });
      }

      if (appointment.status === 'completed' || appointment.status === 'approved') {
        return res.status(400).json({ message: 'Completed or approved appointments cannot be cancelled' });
      }

      appointment.status = 'cancelled';
    } else {
      return res.status(403).json({ message: 'Not authorized to update appointment' });
    }

    await appointment.save();
    await appointment.populate(patientPopulate);

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update appointment details', error: err.message });
  }
};