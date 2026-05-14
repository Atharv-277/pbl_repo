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
const adminRoutes = require('./Routes/adminRoutes');
const { errorHandler } = require('./Middleware/errorMiddleware');

dotenv.config();

const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variable(s): ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

connectDB();

// Create uploads directories if they don't exist
const createUploadDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const doctorProfilesDir = path.join(uploadsDir, 'doctor-profiles');
  const patientProfilesDir = path.join(uploadsDir, 'patient-profiles');
  const doctorCertificatesDir = path.join(uploadsDir, 'doctor-certificates');
  const profilePhotosDir = path.join(uploadsDir, 'profile-photos');

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

  if (!fs.existsSync(doctorCertificatesDir)) {
    fs.mkdirSync(doctorCertificatesDir, { recursive: true });
    console.log('Created doctor-certificates directory');
  }

  if (!fs.existsSync(profilePhotosDir)) {
    fs.mkdirSync(profilePhotosDir, { recursive: true });
    console.log('Created profile-photos directory');
  }
};

createUploadDirectories();

const app = express();
const configuredOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
].filter(Boolean);

if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
  console.warn('FRONTEND_URL/FRONTEND_URLS is not set. Allowing trusted deployment domains (Netlify/Vercel).');
}

const deploymentDomainPatterns = [
  /^https:\/\/[a-zA-Z0-9-]+\.netlify\.app$/,
  /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,
];

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return deploymentDomainPatterns.some((pattern) => pattern.test(origin));
};

app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like Postman/curl)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) return callback(null, true);

      return callback(new Error('CORS not allowed for this origin'));
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

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

