const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Doctor = require('../Models/Doctor');
const Patient = require('../Models/Patient');
const generateToken = require('../utils/generateToken');

// Register Controller
exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phoneNo,
            gender,
            address,
            role,
            specialization,
            qualification,
            experience,
            licenceNo,
            hospitalName,
            fees
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile photo upload
        const profileImagePath = req.files?.profileImage?.[0]
            ? req.files.profileImage[0].path.replace(/\\/g, '/')
            : null;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phoneNo,
            gender,
            address,
            profileImage: profileImagePath,
        });

        if (role === 'doctor') {
            await Doctor.create({
                userId: user._id,
                specialization,
                qualification,
                experience,
                licenceNo,
                hospitalName,
                fees,
                licenceCertificate: req.files?.licenceCertificate?.[0]
                    ? req.files.licenceCertificate[0].path.replace(/\\/g, '/')
                    : null,
                status: 'pending'
            });

            // Doctor registration is pending — do NOT issue a token
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNo: user.phoneNo,
                gender: user.gender,
                address: user.address,
                profileImage: user.profileImage,
                pending: true,
                message: "Registration submitted successfully! Please wait for admin approval before you can log in."
            });
        } else if (role === 'patient') {
            await Patient.create({ userId: user._id });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            phoneNo: user.phoneNo,
            gender: user.gender,
            address: user.address,
            profileImage: user.profileImage,
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user)
            return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match ? 'Yes' : 'No');
        
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });

        // If doctor, check approval status
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: user._id });
            if (!doctor) {
                return res.status(400).json({ message: "Doctor profile not found" });
            }
            if (doctor.status === 'pending') {
                return res.status(403).json({ 
                    message: "Your account is pending admin approval. Please wait for the admin to review your registration.",
                    status: 'pending'
                });
            }
            if (doctor.status === 'rejected') {
                return res.status(403).json({ 
                    message: "Your registration has been rejected by the admin. Please contact support for more information.",
                    status: 'rejected'
                });
            }
        }

        const token = generateToken(user._id);
        console.log('Token generated successfully');

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            phoneNo: user.phoneNo,
            gender: user.gender,
            address: user.address,
            profileImage: user.profileImage,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
