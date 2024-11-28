const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const Doctor = require('../models/DoctorSchema');
require('dotenv').config();

const JWToken = process.env.JWT_SECRET_KEY;

exports.authVarify = (req, res, next) => {
    let token = req.headers['token'];

    if (!token) {
        return res.status(401).json({ status: 'unauthorized', message: 'No token provided' });
    }

    jwt.verify(token, JWToken, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'unauthorized', message: 'Invalid token' });
        }

        // Extract id and role from the token's payload
        const { id, role } = decoded;

        if (!id || !role) {
            return res.status(400).json({ status: 'bad request', message: 'Invalid token payload' });
        }

        // Attach id and role to the request headers
        req.headers.id = id;
        req.headers.role = role;

        console.log('User ID:', id);
        console.log('User Role:', role);

        next();
    });
};


exports.restrict = (roles) => async (req, res, next) => {
    const userId = req.headers.id;
    

    let user;

    // Attempt to find the user in both collections
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);
    
    if (patient) {
        user = patient;
    } else if (doctor) {
        user = doctor;
    }

    // If no user is found, return an error response
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(user.role)) {
        return res.status(401).json({
            success: false,
            message: "You're not authorized",
        });
    }

    // Proceed to the next middleware
    next();
};
