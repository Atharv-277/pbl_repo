const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['doctor', 'patient', 'admin'], required: true },
    phoneNo: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String },
    profileImage: { type: String, default: null }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
