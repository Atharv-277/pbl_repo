// Usage: node scripts/fixData.js
// This script scans for and logs (optionally fixes) broken patient/appointment references.

const mongoose = require('mongoose');
const path = require('path');
const dbPath = path.resolve(__dirname, '../config/db.js');
require(dbPath); // Ensure DB connection

const Patient = require('../Models/Patient');
const Appointment = require('../Models/Appointments');
const Doctor = require('../Models/Doctor');
const User = require('../Models/User');

async function scanAndLog() {
  console.log('--- Scanning for broken appointments and patients ---');
  const appointments = await Appointment.find({}).populate('patient');
  for (const apt of appointments) {
    if (!apt.patient) {
      console.log('Appointment missing patient:', apt._id);
    } else if (!apt.patient.userId) {
      console.log('Patient missing userId:', apt.patient._id);
    }
  }
  const patients = await Patient.find({ doctor: null });
  for (const patient of patients) {
    console.log('Patient missing doctor:', patient._id);
  }
}

async function main() {
  await scanAndLog();
  mongoose.disconnect();
}

main();