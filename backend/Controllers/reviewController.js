const Review = require("../models/ReviewSchema");
const Doctor = require("../models/DoctorSchema");
const { default: mongoose } = require("mongoose");

//get All Reviews
exports.getAllReviews = async(req, res) => {
    try {
        const reviews = await Review.find({});

        res.status(200).json({success: true, message: "Successful", data: reviews});
    } catch (error) {
        res.status(404).json({success: false, message: "Not Found"})
    }
}

//create review
exports.createReview = async (req, res) => {
    try {
        // Ensure doctor and user IDs are set
        if (!req.body.doctor) req.body.doctor = req.params.doctorId;
        if (!req.body.user) req.body.user = req.headers.id;

        // Create a new review instance
        const newReview = new Review(req.body);

        // Save the review to the database
        const savedReview = await newReview.save();
        console.log("Saved Review:", savedReview);

        // Add the review to the doctor's `reviews` array
        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: { reviews: savedReview._id },
        });

        // Calculate the new average rating and total ratings for the doctor
        const stats = await Review.aggregate([
            {
                $match: { doctor: new mongoose.Types.ObjectId(req.body.doctor) }, // Match all reviews for the doctor
            },
            {
                $group: {
                    _id: "$doctor",
                    numOfRatings: { $sum: 1 }, // Count total number of reviews
                    avgRating: { $avg: "$rating" }, // Calculate average rating
                },
            },
        ]);

        // Update the doctor's document with the new stats
        if (stats.length > 0) {
            await Doctor.findByIdAndUpdate(req.body.doctor, {
                totalRating: stats[0].numOfRatings,
                averageRating: stats[0].avgRating,
            });
        } else {
            // If no stats are found, reset ratings
            await Doctor.findByIdAndUpdate(req.body.doctor, {
                totalRating: 0,
                averageRating: 0,
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "Review Submitted and Ratings Updated",
            data: savedReview,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

