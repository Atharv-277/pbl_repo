const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./Routes/authRoutes');
const doctorRoutes = require('./Routes/doctorRoutes');
const patientRoutes = require('./Routes/patientRoutes');
const appointmentRoutes = require('./Routes/appointmentRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const { errorHandler } = require('./Middleware/errorMiddleware');

dotenv.config();
connectDB();

// Create uploads directories if they don't exist
const createUploadDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const doctorProfilesDir = path.join(uploadsDir, 'doctor-profiles');
  const patientProfilesDir = path.join(uploadsDir, 'patient-profiles');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }
  
  if (!fs.existsSync(doctorProfilesDir)) {
    fs.mkdirSync(doctorProfilesDir, { recursive: true });
    console.log('Created doctor-profiles directory');
  }
  
  if (!fs.existsSync(patientProfilesDir)) {
    fs.mkdirSync(patientProfilesDir, { recursive: true });
    console.log('Created patient-profiles directory');
  }
};

createUploadDirectories();

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like Postman/curl)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (isAllowed) return callback(null, true);

      return callback(new Error('CORS not allowed for this origin'));
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /api/auth/login');
    console.log('- POST /api/auth/register');
    console.log('- GET /api/appointments/my-appointments');
    console.log('- GET /api/doctors');
    console.log('- GET /api/patients/dashboard');
});

