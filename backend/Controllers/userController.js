const User = require("../models/UserSchema");
const Booking = require("../models/BookingSchema");
const Doctor = require("../models/DoctorSchema");

exports.updateUser = async (req, res) =>{
    const id = req.params.id;
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        res.status(200).json({success: true, message: "Successfully Updated", data: updateUser})
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to Update" });
    }
}

exports.deleteUser = async (req, res) =>{
    const id = req.params.id;
    try {
        await User.findByIdAndDelete( id )

        res.status(200).json({success: true, message: "Successfully Deleted" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to Delete" });
    }
}

exports.getSingleUser = async (req, res) =>{
    const id = req.params.id;
    try {
        const user = await User.findById( id ).select("-password")

        res.status(200).json({success: true, message: "User Found", data: user})
    } catch (error) {
        res.status(404).json({ success: false, message: "No User Found" });
    }
}

exports.getAllUser = async (req, res) =>{
    try {
        const users = await User.find( {} ).select("-password")

        res.status(200).json({success: true, message: "Users Found", data: users})
    } catch (error) {
        res.status(404).json({ success: false, message: "Not Found" });
    }
}


exports.getUserProfile = async(req, res) =>{
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({success:false, message:'User not found'})
        }

        const {password, ...rest} = user._doc

        res.status(200).json({success:true, message:'Profile info is getting', data:{...rest}})
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went worng, cannot get" });
    }
}


exports.getMyAppointments = async(req,res) =>{
    try {
        //step-1: retrieve appointments from booking for specific user
        const bookings = await Booking.find({user: req.userId})
        //step-2: extract doctor ids from appointment bookings
        const doctorIds = bookings.map(el => el.doctor.id)
        //step-3: retrieve doctors using doctor ids
        const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password')

        res.status(200).json({success:true, message: 'Appointments are getting', data: doctors})
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went worng, cannot get" });
    }
}