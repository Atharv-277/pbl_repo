const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ message: "Token failed" });
    }
};

module.exports = { protect };
