const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from Backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../Models/User');

const ADMIN_EMAIL = 'admin@mediconnect.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin';

async function seedAdmin() {
    try {
        const mongoUri =
            process.env.MONGO_URI ||
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/health_management';

        await mongoose.connect(mongoUri, {});
        console.log('MongoDB connected');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log('Admin user already exists:');
            console.log(`  Email: ${ADMIN_EMAIL}`);
            console.log(`  Role: ${existing.role}`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin user created successfully!');
        console.log(`  Email: ${ADMIN_EMAIL}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log(`  ID: ${admin._id}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
}

seedAdmin();
