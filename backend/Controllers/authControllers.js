const User = require ('../models/UserSchema');
const Doctor = require ('../models/DoctorSchema');
const {hashPass, comparePass} = require ('../utils/bcryptPassword');
const CreateToken = require('../utils/createToken')

exports.register = async (req, res) => {
    const { name, email, password, role, photo, gender } = req.body;
    try {
        let user = null;

        // Check if user exists based on role
        if (role === 'patient') {
            user = await User.findOne({ email });
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email });
        }

        // If user already exists, return an error
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPass(password);

        // Create new user based on role
        if (role === 'patient') {
            user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                photo,
                gender,
            });
        } else if (role === 'doctor') {
            user = new Doctor({
                name,
                email,
                password: hashedPassword,
                role,
                photo,
                gender,
            });
        }

        // Save the new user
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in both collections
        const user = await User.findOne({ email }) || await Doctor.findOne({ email });

        // If user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await comparePass(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token for the user
        const token = await CreateToken({_id: user._id, role: user.role});

        // Exclude sensitive or unnecessary data
        const { password: _, ...userDetails } = user._doc;

        res.status(200).json({
            message: 'Login successful',
            user: userDetails,
            role: user.role || 'unknown', // default role if not present
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


exports.changePassword = async (req, res) => {
    try {
      const {currentPassword, newPassword } = req.body;
  
      // Find the user by email
      const email = req.headers['email'];
          const user =  await Doctor.findOne({ email: email });
  
          if (!user) {
              return { status: "fail", data: "User not found" };
          }
  
      // Compare the current password with the stored hashed password
      const isMatch = await comparePass(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
  
      // Hash the new password
      const hashedNewPassword = await hashPass(newPassword);
  
      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error: error.message });
    }
  };