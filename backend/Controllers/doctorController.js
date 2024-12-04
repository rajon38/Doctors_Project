const Doctor = require("../models/DoctorSchema");
const Booking = require("../models/BookingSchema");

exports.updateDoctor = async (req, res) =>{
    const id = req.params.id;
    try {
        const updateDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        res.status(200).json({success: true, message: "Successfully Updated", data: updateDoctor})
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to Update" });
    }
}

exports.deleteDoctor = async (req, res) =>{
    const id = req.params.id;
    try {
        await Doctor.findByIdAndDelete( id )

        res.status(200).json({success: true, message: "Successfully Deleted" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to Delete" });
    }
}

exports.getSingleDoctor= async (req, res) =>{
    const id = req.params.id;
    try {
        const doctor = await Doctor.findById( id ).populate("reviews").select("-password")

        res.status(200).json({success: true, message: "User Found", data: doctor})
    } catch (error) {
        res.status(404).json({ success: false, message: "No User Found" });
    }
}

exports.getAllDoctor = async (req, res) =>{
    try {
        const { query } = req.query;
        let doctors;
        if(query){
            doctors = await Doctor.find( { isApproved: 'approved', $or: [
                {name: {$regex: query, $option: "i"}},
                {specialization: {$regex: query, $option: "i"}},
            ]} ).populate("reviews").select("-password")
        }else{
            doctors = await Doctor.find({ isApproved: 'approved' }).select("-password")
        }

        res.status(200).json({success: true, message: "Users Found", data: doctors})
    } catch (error) {
        res.status(404).json({ success: false, message: "Not Found" });
    }
}

exports.getDoctorProfile = async(req, res) =>{
    const doctorId = req.userId

    try {
        const doctor = await Doctor.findById(doctorId)

        if (!doctor) {
            return res.status(404).json({success:false, message:'Doctor not found'})
        }

        const {password, ...rest} = doctor._doc
        const appointments = await Booking.find({doctor: doctorId})

        res.status(200).json({success:true, message:'Profile info is getting', data:{...rest, appointments}})
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went worng, cannot get" });
    }
}